import { createContext, use, useReducer, type ReactNode } from 'react';

import { SEED_BETS } from '@/data/bets';
import { toSelection } from '@/data/matches';
import type { Bet, Market, Match, OddsFormat, Outcome, Selection } from '@/data/types';
import { cashOutOffer, combinedOdds } from '@/utils/bets';
import { formatOdds } from '@/utils/format';

type BettingState = {
  balance: number;
  /** Bet slip selections, at most one per match. */
  selections: Selection[];
  /** Placed bets, newest first. */
  bets: Bet[];
  oddsFormat: OddsFormat;
};

type BettingAction =
  | { type: 'toggleSelection'; selection: Selection }
  | { type: 'removeSelection'; outcomeId: string }
  | { type: 'clearSelections' }
  | { type: 'placeBet'; bet: Bet }
  | { type: 'cashOut'; betId: string; amount: number }
  | { type: 'deposit'; amount: number }
  | { type: 'setOddsFormat'; oddsFormat: OddsFormat };

const initialState: BettingState = {
  balance: 250,
  selections: [],
  bets: SEED_BETS,
  oddsFormat: 'decimal',
};

function reducer(state: BettingState, action: BettingAction): BettingState {
  switch (action.type) {
    case 'toggleSelection': {
      const { selection } = action;
      const { selections } = state;
      if (selections.some((existing) => existing.outcomeId === selection.outcomeId)) {
        return {
          ...state,
          selections: selections.filter((existing) => existing.outcomeId !== selection.outcomeId),
        };
      }
      // Only one selection per match: picking another outcome replaces the previous one.
      if (selections.some((existing) => existing.matchId === selection.matchId)) {
        return {
          ...state,
          selections: selections.map((existing) =>
            existing.matchId === selection.matchId ? selection : existing
          ),
        };
      }
      return { ...state, selections: [...selections, selection] };
    }
    case 'removeSelection':
      return {
        ...state,
        selections: state.selections.filter((selection) => selection.outcomeId !== action.outcomeId),
      };
    case 'clearSelections':
      return { ...state, selections: [] };
    case 'placeBet':
      return {
        ...state,
        balance: state.balance - action.bet.stake,
        selections: [],
        bets: [action.bet, ...state.bets],
      };
    case 'cashOut':
      return {
        ...state,
        balance: state.balance + action.amount,
        bets: state.bets.map((bet) =>
          bet.id === action.betId ? { ...bet, status: 'cashedOut', payout: action.amount } : bet
        ),
      };
    case 'deposit':
      return { ...state, balance: state.balance + action.amount };
    case 'setOddsFormat':
      return { ...state, oddsFormat: action.oddsFormat };
  }
}

type BettingContextValue = BettingState & {
  isSelected: (outcomeId: string) => boolean;
  toggleSelection: (match: Match, market: Market, outcome: Outcome) => void;
  removeSelection: (outcomeId: string) => void;
  clearSelections: () => void;
  /** Places the current selections as one bet and returns it. */
  placeBet: (stake: number) => Bet;
  cashOut: (bet: Bet) => void;
  deposit: (amount: number) => void;
  setOddsFormat: (oddsFormat: OddsFormat) => void;
  /** Formats decimal odds in the user's preferred format. */
  formatOdds: (odds: number) => string;
};

const BettingContext = createContext<BettingContextValue | null>(null);

/** In-memory betting state for the dummy app: wallet, bet slip, placed bets and preferences. */
export function BettingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: BettingContextValue = {
    ...state,
    isSelected: (outcomeId) =>
      state.selections.some((selection) => selection.outcomeId === outcomeId),
    toggleSelection: (match, market, outcome) =>
      dispatch({ type: 'toggleSelection', selection: toSelection(match, market, outcome) }),
    removeSelection: (outcomeId) => dispatch({ type: 'removeSelection', outcomeId }),
    clearSelections: () => dispatch({ type: 'clearSelections' }),
    placeBet: (stake) => {
      const bet: Bet = {
        id: `bet-${Date.now()}`,
        selections: state.selections,
        stake,
        odds: combinedOdds(state.selections),
        placedAt: new Date().toISOString(),
        status: 'open',
      };
      dispatch({ type: 'placeBet', bet });
      return bet;
    },
    cashOut: (bet) => dispatch({ type: 'cashOut', betId: bet.id, amount: cashOutOffer(bet) }),
    deposit: (amount) => dispatch({ type: 'deposit', amount }),
    setOddsFormat: (oddsFormat) => dispatch({ type: 'setOddsFormat', oddsFormat }),
    formatOdds: (odds) => formatOdds(odds, state.oddsFormat),
  };

  return <BettingContext value={value}>{children}</BettingContext>;
}

export function useBetting(): BettingContextValue {
  const context = use(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
}
