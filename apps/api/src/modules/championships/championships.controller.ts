import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChampionshipStatus, Role } from '@prisma/client';
import { ChampionshipsService } from './championships.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Championships')
@Controller('championships')
export class ChampionshipsController {
  constructor(private readonly service: ChampionshipsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar campeonatos' })
  findAll(@Query('status') status?: ChampionshipStatus) {
    return this.service.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do campeonato' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Criar campeonato' })
  create(@Body() dto: CreateChampionshipDto) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Atualizar status do campeonato' })
  updateStatus(@Param('id') id: string, @Body('status') status: ChampionshipStatus) {
    return this.service.updateStatus(id, status);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Entrar em um campeonato' })
  join(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.service.joinChampionship(userId, id);
  }

  @Get('my/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Meus campeonatos' })
  myChampionships(@CurrentUser('id') userId: string) {
    return this.service.getUserChampionships(userId);
  }
}
