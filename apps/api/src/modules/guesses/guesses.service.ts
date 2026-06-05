import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

export class CreateGuessDto {
  matchId: string;
  homeScoreGuess: number;
  awayScoreGuess: number;
}

@Injectable()
export class GuessesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateGuessDto) {
    const match = await this.prisma.match.findUnique({ where: { id: dto.matchId } });
    if (!match) throw new NotFoundException('Partida não encontrada');
    if (!match.guessOpen) throw new ForbiddenException('Palpites estão fechados para esta partida');

    const existing = await this.prisma.guess.findUnique({
      where: { userId_matchId: { userId, matchId: dto.matchId } },
    });
    if (existing) throw new ConflictException('Você já fez um palpite nesta partida. Use PUT para editar.');

    return this.prisma.guess.create({
      data: { userId, matchId: dto.matchId, homeScoreGuess: dto.homeScoreGuess, awayScoreGuess: dto.awayScoreGuess },
    });
  }

  async update(userId: string, matchId: string, dto: Omit<CreateGuessDto, 'matchId'>) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Partida não encontrada');
    if (!match.guessOpen) throw new ForbiddenException('Palpites estão fechados para esta partida');

    const guess = await this.prisma.guess.findUnique({
      where: { userId_matchId: { userId, matchId } },
    });
    if (!guess) throw new NotFoundException('Palpite não encontrado');

    return this.prisma.guess.update({
      where: { id: guess.id },
      data: { homeScoreGuess: dto.homeScoreGuess, awayScoreGuess: dto.awayScoreGuess },
    });
  }

  getUserGuessesForChampionship(userId: string, championshipId: string) {
    return this.prisma.guess.findMany({
      where: { userId, match: { championshipId } },
      include: {
        match: {
          select: {
            id: true,
            matchDate: true,
            homeScore: true,
            awayScore: true,
            status: true,
            homeTeam: { select: { id: true, name: true, shortName: true, logoUrl: true } },
            awayTeam: { select: { id: true, name: true, shortName: true, logoUrl: true } },
          },
        },
      },
      orderBy: { match: { matchDate: 'asc' } },
    });
  }
}
