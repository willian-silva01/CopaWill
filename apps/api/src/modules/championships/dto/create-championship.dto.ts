import { IsString, IsOptional, MaxLength, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScoringConfigDto {
  exact_score: number;
  correct_winner: number;
  correct_draw: number;
  wrong: number;
}

export class CreateChampionshipDto {
  @ApiProperty({ example: 'Copa do Mundo 2026' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: '2026' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  season?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  scoringConfig?: ScoringConfigDto;
}
