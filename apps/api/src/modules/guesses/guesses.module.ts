import { Module } from '@nestjs/common';
import { GuessesController } from './guesses.controller';
import { GuessesService } from './guesses.service';

@Module({
  controllers: [GuessesController],
  providers: [GuessesService],
})
export class GuessesModule {}
