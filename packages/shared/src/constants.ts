export const DEFAULT_SCORING_CONFIG = {
  exact_score: 5,
  correct_winner: 3,
  correct_draw: 3,
  wrong: 0,
} as const;

export const CHAMPIONSHIP_STATUSES = ['DRAFT', 'OPEN', 'IN_PROGRESS', 'FINISHED', 'ARCHIVED'] as const;
export const MATCH_STATUSES = ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'] as const;
export const PHASE_TYPES = ['GROUP_STAGE', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL'] as const;

export const PHASE_LABELS: Record<string, string> = {
  GROUP_STAGE: 'Fase de Grupos',
  ROUND_OF_16: 'Oitavas de Final',
  QUARTER_FINAL: 'Quartas de Final',
  SEMI_FINAL: 'Semifinal',
  THIRD_PLACE: 'Disputa de Terceiro',
  FINAL: 'Final',
};

export const MATCH_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Agendado',
  LIVE: 'Ao Vivo',
  FINISHED: 'Encerrado',
  POSTPONED: 'Adiado',
  CANCELLED: 'Cancelado',
};
