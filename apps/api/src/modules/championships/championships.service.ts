import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ChampionshipStatus } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';

@Injectable()
export class ChampionshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: ChampionshipStatus) {
    return this.prisma.championship.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        country: true,
        season: true,
        status: true,
        _count: { select: { userChampionships: true } },
      },
    });
  }

  async findOne(id: string) {
    const championship = await this.prisma.championship.findUnique({
      where: { id },
      include: {
        phases: { orderBy: { phaseOrder: 'asc' } },
        _count: { select: { userChampionships: true } },
      },
    });
    if (!championship) throw new NotFoundException('Campeonato não encontrado');
    return championship;
  }

  async create(dto: CreateChampionshipDto) {
    return this.prisma.championship.create({
      data: {
        name: dto.name,
        description: dto.description,
        country: dto.country,
        season: dto.season,
        scoringConfig: dto.scoringConfig ?? {
          exact_score: 5,
          correct_winner: 3,
          correct_draw: 3,
          wrong: 0,
        },
      },
    });
  }

  async updateStatus(id: string, status: ChampionshipStatus) {
    await this.findOne(id);
    return this.prisma.championship.update({ where: { id }, data: { status } });
  }

  async joinChampionship(userId: string, championshipId: string) {
    const championship = await this.findOne(championshipId);

    if (championship.status !== ChampionshipStatus.OPEN) {
      throw new ForbiddenException('Este campeonato não está aceitando participantes');
    }

    await this.prisma.userChampionship.upsert({
      where: { userId_championshipId: { userId, championshipId } },
      create: { userId, championshipId },
      update: {},
    });

    return { message: 'Você entrou no campeonato!' };
  }

  async getUserChampionships(userId: string) {
    return this.prisma.userChampionship.findMany({
      where: { userId },
      include: {
        championship: {
          select: { id: true, name: true, logoUrl: true, status: true, season: true },
        },
      },
    });
  }
}
