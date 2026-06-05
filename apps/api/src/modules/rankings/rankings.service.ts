import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class RankingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getChampionshipRanking(championshipId: string, userId?: string) {
    const rankings = await this.prisma.ranking.findMany({
      where: { championshipId, phaseId: null, roundId: null },
      include: {
        user: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
      orderBy: [{ totalPoints: 'desc' }, { exactScores: 'desc' }],
    });

    // Calcular posições
    const ranked = rankings.map((r, index) => ({
      ...r,
      position: index + 1,
      isCurrentUser: r.userId === userId,
    }));

    return ranked;
  }

  async getRoundRanking(championshipId: string, roundId: string, userId?: string) {
    return this.prisma.ranking.findMany({
      where: { championshipId, roundId },
      include: {
        user: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
      orderBy: { totalPoints: 'desc' },
    });
  }

  async getPhaseRanking(championshipId: string, phaseId: string) {
    return this.prisma.ranking.findMany({
      where: { championshipId, phaseId, roundId: null },
      include: {
        user: { select: { id: true, name: true, username: true, avatarUrl: true } },
      },
      orderBy: { totalPoints: 'desc' },
    });
  }

  async getUserStats(userId: string, championshipId: string) {
    const ranking = await this.prisma.ranking.findFirst({
      where: { userId, championshipId, phaseId: null, roundId: null },
    });

    const guesses = await this.prisma.guess.findMany({
      where: { userId, match: { championshipId }, points: { not: null } },
      select: { points: true },
    });

    const totalGuesses = guesses.length;
    const exactScores = guesses.filter((g) => g.points === 5).length;
    const correctWinners = guesses.filter((g) => g.points === 3).length;
    const wrongs = guesses.filter((g) => g.points === 0).length;
    const accuracy = totalGuesses > 0 ? ((exactScores + correctWinners) / totalGuesses) * 100 : 0;

    return {
      totalPoints: ranking?.totalPoints ?? 0,
      position: ranking?.position ?? null,
      totalGuesses,
      exactScores,
      correctWinners,
      wrongs,
      accuracy: Math.round(accuracy),
    };
  }
}
