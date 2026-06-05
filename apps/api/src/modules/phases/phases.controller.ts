import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PhasesService, CreatePhaseDto, CreateRoundDto, CreateGroupDto } from './phases.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Phases')
@Controller('phases')
export class PhasesController {
  constructor(private readonly service: PhasesService) {}

  @Get('championship/:championshipId')
  @ApiOperation({ summary: 'Fases de um campeonato' })
  findByChampionship(@Param('championshipId') championshipId: string) {
    return this.service.findByChampionship(championshipId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Criar fase' })
  createPhase(@Body() dto: CreatePhaseDto) {
    return this.service.createPhase(dto);
  }

  @Post('rounds')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Criar rodada' })
  createRound(@Body() dto: CreateRoundDto) {
    return this.service.createRound(dto);
  }

  @Post('groups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Criar grupo' })
  createGroup(@Body() dto: CreateGroupDto) {
    return this.service.createGroup(dto);
  }
}
