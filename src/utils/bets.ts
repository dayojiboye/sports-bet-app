import type { Bet, Selection } from '@/data/types';

/** Combined decimal odds of an accumulator. */
export function combinedOdds(selections: Selection[]): number {
  const product = selections.reduce((total, selection) => total * selection.odds, 1);
  return Math.round(product * 100) / 100;
}

export function potentialReturn(stake: number, odds: number): number {
  return Math.round(stake * odds * 100) / 100;
}

/** Dummy cash-out offer for an open bet: a fixed share of its potential return. */
export function cashOutOffer(bet: Bet): number {
  return Math.round(potentialReturn(bet.stake, bet.odds) * 0.55 * 100) / 100;
}

export function betTitle(bet: Pick<Bet, 'selections'>): string {
  const legs = bet.selections.length;
  if (legs === 1) return 'Single';
  if (legs === 2) return 'Double';
  if (legs === 3) return 'Treble';
  return `${legs}-Fold Accumulator`;
}
