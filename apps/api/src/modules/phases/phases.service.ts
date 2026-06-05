import { Injectable, NotFoundException } from '@nestjs/common';
import { PhaseType } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';

export class CreatePhaseDto {
  championshipId: string;
  name: string;
  type: PhaseType;
  phaseOrder: number;
}

export class CreateRoundDto {
  phaseId: string;
  name: string;
  number: number;
}

export class CreateGroupDto {
  phaseId: string;
  name: string;
  teamIds: string[];
}

@Injectable()
export class PhasesService {
  constructor(private readonly prisma: PrismaService) {}

  findByChampionship(championshipId: string) {
    return this.prisma.phase.findMany({
      where: { championshipId },
      include: {
        rounds: { orderBy: { number: 'asc' } },
        groups: { include: { groupTeams: { include: { team: true } } } },
      },
      orderBy: { phaseOrder: 'asc' },
    });
  }

  createPhase(dto: CreatePhaseDto) {
    return this.prisma.phase.create({ data: dto });
  }

  createRound(dto: CreateRoundDto) {
    return this.prisma.round.create({ data: { phaseId: dto.phaseId, name: dto.name, number: dto.number } });
  }

  async createGroup(dto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        phaseId: dto.phaseId,
        name: dto.name,
        groupTeams: {
          create: dto.teamIds.map((teamId) => ({ teamId })),
        },
      },
      include: { groupTeams: { include: { team: true } } },
    });
  }
}
