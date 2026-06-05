import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChampionshipsModule } from './modules/championships/championships.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PhasesModule } from './modules/phases/phases.module';
import { MatchesModule } from './modules/matches/matches.module';
import { GuessesModule } from './modules/guesses/guesses.module';
import { RankingsModule } from './modules/rankings/rankings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ChampionshipsModule,
    TeamsModule,
    PhasesModule,
    MatchesModule,
    GuessesModule,
    RankingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
