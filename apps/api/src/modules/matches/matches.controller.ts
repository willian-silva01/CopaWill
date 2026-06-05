import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { MatchesService, CreateMatchDto, SetResultDto } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly service: MatchesService) {}

  @Get('championship/:championshipId')
  @ApiOperation({ summary: 'Partidas de um campeonato' })
  findByChampionship(
    @Param('championshipId') championshipId: string,
    @Query('phaseId') phaseId?: string,
  ) {
    return this.service.findByChampionship(championshipId, phaseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da partida' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Criar partida' })
  create(@Body() dto: CreateMatchDto) {
    return this.service.create(dto);
  }

  @Patch(':id/result')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Inserir resultado' })
  setResult(@Param('id') id: string, @Body() dto: SetResultDto) {
    return this.service.setResult(id, dto);
  }

  @Patch(':id/toggle-guess')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Abrir/fechar palpites' })
  toggleGuess(@Param('id') id: string) {
    return this.service.toggleGuessOpen(id);
  }
}
