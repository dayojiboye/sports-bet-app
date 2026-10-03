export type Sport = 'football' | 'basketball' | 'tennis';

export type OddsFormat = 'decimal' | 'fractional' | 'american';

export type Outcome = {
  id: string;
  /** Full label, e.g. "Arsenal" or "Over 2.5". */
  label: string;
  /** Compact label for match lists, e.g. "1", "X", "2". */
  shortLabel: string;
  /** Decimal odds. */
  odds: number;
};

export type Market = {
  id: string;
  name: string;
  outcomes: Outcome[];
};

export type MatchStatus =
  | { state: 'upcoming'; startsAt: string }
  | { state: 'live'; clock: string; score: [home: string, away: string] };

export type Match = {
  id: string;
  sport: Sport;
  competition: string;
  home: string;
  away: string;
  status: MatchStatus;
  /** The first market is the main market shown in match lists. */
  markets: Market[];
};

export type Selection = {
  outcomeId: string;
  matchId: string;
  matchName: string;
  marketName: string;
  outcomeLabel: string;
  odds: number;
};

export type BetStatus = 'open' | 'won' | 'lost' | 'cashedOut';

export type Bet = {
  id: string;
  selections: Selection[];
  stake: number;
  /** Combined decimal odds at the time the bet was placed. */
  odds: number;
  placedAt: string;
  status: BetStatus;
  /** Amount returned once the bet is won or cashed out. */
  payout?: number;
};
