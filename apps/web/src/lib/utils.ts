import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(new Date(date));
}

export function getGuessResultColor(points: number | null): string {
  if (points === null) return 'text-muted-foreground';
  if (points >= 5) return 'text-brand-gold';
  if (points >= 3) return 'text-brand-green';
  return 'text-destructive';
}

export function getGuessResultLabel(
  homeGuess: number,
  awayGuess: number,
  homeResult: number,
  awayResult: number,
): string {
  if (homeGuess === homeResult && awayGuess === awayResult) return 'Placar exato!';
  const guessWinner =
    homeGuess > awayGuess ? 'home' : awayGuess > homeGuess ? 'away' : 'draw';
  const resultWinner =
    homeResult > awayResult ? 'home' : awayResult > homeResult ? 'away' : 'draw';
  if (guessWinner === resultWinner) return 'Acertou o vencedor';
  return 'Errou';
}
