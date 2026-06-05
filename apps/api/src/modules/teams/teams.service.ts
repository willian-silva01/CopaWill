import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

export class CreateTeamDto {
  name: string;
  shortName?: string;
  country?: string;
  logoUrl?: string;
}

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string) {
    return this.prisma.team.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundException('Time não encontrado');
    return team;
  }

  create(dto: CreateTeamDto) {
    return this.prisma.team.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateTeamDto>) {
    await this.findOne(id);
    return this.prisma.team.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.team.delete({ where: { id } });
  }
}
