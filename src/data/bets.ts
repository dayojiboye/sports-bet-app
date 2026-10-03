import { MATCHES, toSelection } from './matches';
import type { Bet, Selection } from './types';

/** Selection on a match from the current fixture list. */
function current(outcomeId: string): Selection {
  for (const match of MATCHES) {
    for (const market of match.markets) {
      const outcome = market.outcomes.find((candidate) => candidate.id === outcomeId);
      if (outcome) return toSelection(match, market, outcome);
    }
  }
  throw new Error(`Unknown outcome: ${outcomeId}`);
}

/** Selection on a match that has already finished. */
function past(
  matchName: string,
  marketName: string,
  outcomeLabel: string,
  odds: number
): Selection {
  const id = `${matchName}-${marketName}-${outcomeLabel}`.toLowerCase().replace(/\W+/g, '-');
  return { outcomeId: id, matchId: id, matchName, marketName, outcomeLabel, odds };
}

/** Bet history the dummy account starts with. */
export const SEED_BETS: Bet[] = [
  {
    id: 'bet-5',
    selections: [current('f2-result-home'), current('b1-total-over')],
    stake: 2_000,
    odds: 4.49,
    placedAt: '2026-10-03T09:15:00Z',
    status: 'open',
  },
  {
    id: 'bet-4',
    selections: [current('t2-winner-home')],
    stake: 5_000,
    odds: 1.7,
    placedAt: '2026-10-02T18:40:00Z',
    status: 'open',
  },
  {
    id: 'bet-3',
    selections: [past('Inter v Juventus', 'Total Goals', 'Over 2.5', 1.85)],
    stake: 3_000,
    odds: 1.85,
    placedAt: '2026-09-28T17:05:00Z',
    status: 'won',
    payout: 5_550,
  },
  {
    id: 'bet-2',
    selections: [
      past('Miami Heat v Chicago Bulls', 'Moneyline', 'Miami Heat', 1.6),
      past('Casper Ruud v Holger Rune', 'Match Winner', 'Casper Ruud', 1.9),
      past('Napoli v Roma', 'Match Result', 'Draw', 3.3),
    ],
    stake: 1_000,
    odds: 10.03,
    placedAt: '2026-09-26T12:30:00Z',
    status: 'lost',
  },
  {
    id: 'bet-1',
    selections: [
      past('Manchester United v Aston Villa', 'Match Result', 'Manchester United', 2.05),
      past('Ajax v PSV', 'Both Teams to Score', 'Yes', 1.5),
    ],
    stake: 2_500,
    odds: 3.08,
    placedAt: '2026-09-20T14:00:00Z',
    status: 'cashedOut',
    payout: 3_700,
  },
];
