export type Role = 'USER' | 'ADMIN';
export type ChampionshipStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'FINISHED' | 'ARCHIVED';
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
export type PhaseType =
  | 'GROUP_STAGE'
  | 'ROUND_OF_16'
  | 'QUARTER_FINAL'
  | 'SEMI_FINAL'
  | 'THIRD_PLACE'
  | 'FINAL';

export interface ScoringConfig {
  exact_score: number;
  correct_winner: number;
  correct_draw: number;
  wrong: number;
}

export function calculatePoints(
  guess: { home: number; away: number },
  result: { home: number; away: number },
  config: ScoringConfig,
): number {
  if (guess.home === result.home && guess.away === result.away) {
    return config.exact_score;
  }

  const guessWinner =
    guess.home > guess.away ? 'home' : guess.away > guess.home ? 'away' : 'draw';
  const resultWinner =
    result.home > result.away ? 'home' : result.away > result.home ? 'away' : 'draw';

  if (guessWinner === resultWinner) {
    return resultWinner === 'draw' ? config.correct_draw : config.correct_winner;
  }

  return config.wrong;
}
