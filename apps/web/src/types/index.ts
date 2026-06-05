export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
}

export interface Championship {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  country?: string;
  season?: string;
  status: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'FINISHED' | 'ARCHIVED';
  scoringConfig: ScoringConfig;
}

export interface ScoringConfig {
  exact_score: number;
  correct_winner: number;
  correct_draw: number;
  wrong: number;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  country?: string;
  logoUrl?: string;
}

export interface Phase {
  id: string;
  championshipId: string;
  name: string;
  type: 'GROUP_STAGE' | 'ROUND_OF_16' | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'THIRD_PLACE' | 'FINAL';
  phaseOrder: number;
}

export interface Match {
  id: string;
  championshipId: string;
  phaseId: string;
  roundId?: string;
  groupId?: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  matchDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
  guessOpen: boolean;
}

export interface Guess {
  id: string;
  userId: string;
  matchId: string;
  homeScoreGuess: number;
  awayScoreGuess: number;
  points?: number;
  match: Match;
}

export interface RankingEntry {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'username' | 'avatarUrl'>;
  totalPoints: number;
  position: number;
  exactScores: number;
  correctWinners: number;
  wrongGuesses: number;
  isCurrentUser?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    perPage: number;
  };
}
