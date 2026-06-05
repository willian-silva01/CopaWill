import { Controller, Get, Param, Query, UseGuards, Optional } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Rankings')
@Controller('rankings')
export class RankingsController {
  constructor(private readonly service: RankingsService) {}

  @Get('championship/:championshipId')
  @ApiOperation({ summary: 'Ranking geral do campeonato' })
  championship(
    @Param('championshipId') championshipId: string,
    @Query('userId') userId?: string,
  ) {
    return this.service.getChampionshipRanking(championshipId, userId);
  }

  @Get('championship/:championshipId/round/:roundId')
  @ApiOperation({ summary: 'Ranking por rodada' })
  round(
    @Param('championshipId') championshipId: string,
    @Param('roundId') roundId: string,
  ) {
    return this.service.getRoundRanking(championshipId, roundId);
  }

  @Get('championship/:championshipId/phase/:phaseId')
  @ApiOperation({ summary: 'Ranking por fase' })
  phase(
    @Param('championshipId') championshipId: string,
    @Param('phaseId') phaseId: string,
  ) {
    return this.service.getPhaseRanking(championshipId, phaseId);
  }

  @Get('championship/:championshipId/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Minhas estatísticas no campeonato' })
  myStats(
    @Param('championshipId') championshipId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.service.getUserStats(userId, championshipId);
  }
}
