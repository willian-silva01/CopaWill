import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';

export class CreateMatchDto {
  championshipId: string;
  phaseId: string;
  roundId?: string;
  groupId?: string;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: Date;
}

export class SetResultDto {
  homeScore: number;
  awayScore: number;
}

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  findByChampionship(championshipId: string, phaseId?: string) {
    return this.prisma.match.findMany({
      where: { championshipId, ...(phaseId && { phaseId }) },
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, logoUrl: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, logoUrl: true } },
        phase: { select: { id: true, name: true, type: true } },
        round: { select: { id: true, name: true, number: true } },
      },
      orderBy: { matchDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        phase: true,
        round: true,
      },
    });
    if (!match) throw new NotFoundException('Partida não encontrada');
    return match;
  }

  create(dto: CreateMatchDto) {
    if (dto.homeTeamId === dto.awayTeamId) {
      throw new BadRequestException('Time mandante e visitante não podem ser iguais');
    }
    return this.prisma.match.create({ data: dto });
  }

  async setResult(id: string, dto: SetResultDto) {
    const match = await this.findOne(id);

    if (match.status === MatchStatus.CANCELLED || match.status === MatchStatus.POSTPONED) {
      throw new BadRequestException('Não é possível inserir resultado nesta partida');
    }

    const updated = await this.prisma.match.update({
      where: { id },
      data: { homeScore: dto.homeScore, awayScore: dto.awayScore, status: MatchStatus.FINISHED },
    });

    // Recalcular pontuações dos palpites desta partida
    await this.calculateGuessPoints(id, dto.homeScore, dto.awayScore, match.championshipId);

    return updated;
  }

  async toggleGuessOpen(id: string) {
    const match = await this.findOne(id);
    return this.prisma.match.update({
      where: { id },
      data: { guessOpen: !match.guessOpen },
    });
  }

  private async calculateGuessPoints(
    matchId: string,
    homeScore: number,
    awayScore: number,
    championshipId: string,
  ) {
    const championship = await this.prisma.championship.findUnique({ where: { id: championshipId } });
    const config = championship?.scoringConfig as any;

    const guesses = await this.prisma.guess.findMany({ where: { matchId } });

    for (const guess of guesses) {
      let points = config?.wrong ?? 0;

      const isExact = guess.homeScoreGuess === homeScore && guess.awayScoreGuess === awayScore;

      const resultWinner =
        homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw';
      const guessWinner =
        guess.homeScoreGuess > guess.awayScoreGuess
          ? 'home'
          : guess.awayScoreGuess > guess.homeScoreGuess
            ? 'away'
            : 'draw';

      if (isExact) {
        points = config?.exact_score ?? 5;
      } else if (resultWinner === guessWinner) {
        points =
          resultWinner === 'draw' ? (config?.correct_draw ?? 3) : (config?.correct_winner ?? 3);
      }

      await this.prisma.guess.update({ where: { id: guess.id }, data: { points } });
    }

    // Recalcular ranking
    await this.recalculateRanking(matchId, championshipId);
  }

  private async recalculateRanking(matchId: string, championshipId: string) {
    const guesses = await this.prisma.guess.findMany({
      where: { matchId },
      select: { userId: true, points: true },
    });

    for (const guess of guesses) {
      if (guess.points === null) continue;

      const allGuesses = await this.prisma.guess.findMany({
        where: {
          userId: guess.userId,
          match: { championshipId },
          points: { not: null },
        },
        select: { points: true },
      });

      const totalPoints = allGuesses.reduce((sum, g) => sum + (g.points ?? 0), 0);

      await this.prisma.ranking.upsert({
        where: {
          userId_championshipId_phaseId_roundId: {
            userId: guess.userId,
            championshipId,
            phaseId: null as any,
            roundId: null as any,
          },
        },
        create: { userId: guess.userId, championshipId, totalPoints },
        update: { totalPoints },
      });
    }
  }
}
