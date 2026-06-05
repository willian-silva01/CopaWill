import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GuessesService, CreateGuessDto } from './guesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Guesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('guesses')
export class GuessesController {
  constructor(private readonly service: GuessesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar palpite' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateGuessDto) {
    return this.service.create(userId, dto);
  }

  @Put(':matchId')
  @ApiOperation({ summary: 'Editar palpite' })
  update(
    @CurrentUser('id') userId: string,
    @Param('matchId') matchId: string,
    @Body() dto: Omit<CreateGuessDto, 'matchId'>,
  ) {
    return this.service.update(userId, matchId, dto);
  }

  @Get('championship/:championshipId')
  @ApiOperation({ summary: 'Meus palpites em um campeonato' })
  myGuesses(@CurrentUser('id') userId: string, @Param('championshipId') championshipId: string) {
    return this.service.getUserGuessesForChampionship(userId, championshipId);
  }
}
