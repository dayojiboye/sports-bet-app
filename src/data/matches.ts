import type { Market, Match, MatchStatus, Outcome, Selection, Sport } from './types';

export const SPORTS: { id: Sport; name: string }[] = [
  { id: 'football', name: 'Football' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'tennis', name: 'Tennis' },
];

const upcoming = (startsAt: string): MatchStatus => ({ state: 'upcoming', startsAt });
const live = (clock: string, home: string, away: string): MatchStatus => ({
  state: 'live',
  clock,
  score: [home, away],
});

function market(
  matchId: string,
  key: string,
  name: string,
  outcomes: [key: string, label: string, shortLabel: string, odds: number][]
): Market {
  return {
    id: `${matchId}-${key}`,
    name,
    outcomes: outcomes.map(
      ([outcomeKey, label, shortLabel, odds]): Outcome => ({
        id: `${matchId}-${key}-${outcomeKey}`,
        label,
        shortLabel,
        odds,
      })
    ),
  };
}

type Fixture = {
  id: string;
  competition: string;
  home: string;
  away: string;
  status: MatchStatus;
};

function football({
  result,
  goals,
  btts,
  ...fixture
}: Fixture & {
  result: [home: number, draw: number, away: number];
  goals: [over: number, under: number];
  btts: [yes: number, no: number];
}): Match {
  const { id, home, away } = fixture;
  return {
    ...fixture,
    sport: 'football',
    markets: [
      market(id, 'result', 'Match Result', [
        ['home', home, '1', result[0]],
        ['draw', 'Draw', 'X', result[1]],
        ['away', away, '2', result[2]],
      ]),
      market(id, 'goals', 'Total Goals', [
        ['over', 'Over 2.5', 'O 2.5', goals[0]],
        ['under', 'Under 2.5', 'U 2.5', goals[1]],
      ]),
      market(id, 'btts', 'Both Teams to Score', [
        ['yes', 'Yes', 'Yes', btts[0]],
        ['no', 'No', 'No', btts[1]],
      ]),
    ],
  };
}

type Line = { line: number; odds: [number, number] };

function basketball({
  moneyline,
  spread,
  total,
  ...fixture
}: Fixture & {
  moneyline: [home: number, away: number];
  /** `line` is the home team's handicap. */
  spread: Line;
  total: Line;
}): Match {
  const { id, home, away } = fixture;
  const homeLine = spread.line > 0 ? `+${spread.line}` : `${spread.line}`;
  const awayLine = spread.line > 0 ? `${-spread.line}` : `+${-spread.line}`;
  return {
    ...fixture,
    sport: 'basketball',
    markets: [
      market(id, 'moneyline', 'Moneyline', [
        ['home', home, '1', moneyline[0]],
        ['away', away, '2', moneyline[1]],
      ]),
      market(id, 'spread', 'Point Spread', [
        ['home', `${home} ${homeLine}`, homeLine, spread.odds[0]],
        ['away', `${away} ${awayLine}`, awayLine, spread.odds[1]],
      ]),
      market(id, 'total', 'Total Points', [
        ['over', `Over ${total.line}`, `O ${total.line}`, total.odds[0]],
        ['under', `Under ${total.line}`, `U ${total.line}`, total.odds[1]],
      ]),
    ],
  };
}

function tennis({
  winner,
  firstSet,
  games,
  ...fixture
}: Fixture & {
  winner: [home: number, away: number];
  firstSet: [home: number, away: number];
  games: Line;
}): Match {
  const { id, home, away } = fixture;
  return {
    ...fixture,
    sport: 'tennis',
    markets: [
      market(id, 'winner', 'Match Winner', [
        ['home', home, '1', winner[0]],
        ['away', away, '2', winner[1]],
      ]),
      market(id, 'first-set', 'First Set Winner', [
        ['home', home, '1', firstSet[0]],
        ['away', away, '2', firstSet[1]],
      ]),
      market(id, 'games', 'Total Games', [
        ['over', `Over ${games.line}`, `O ${games.line}`, games.odds[0]],
        ['under', `Under ${games.line}`, `U ${games.line}`, games.odds[1]],
      ]),
    ],
  };
}

export const MATCHES: Match[] = [
  football({
    id: 'f1',
    competition: 'Premier League',
    home: 'Arsenal',
    away: 'Chelsea',
    status: live("67'", '2', '1'),
    result: [1.45, 4.2, 7.5],
    goals: [1.3, 3.4],
    btts: [1.2, 4.0],
  }),
  football({
    id: 'f2',
    competition: 'Premier League',
    home: 'Liverpool',
    away: 'Manchester City',
    status: upcoming('Today · 20:00'),
    result: [2.4, 3.6, 2.75],
    goals: [1.62, 2.25],
    btts: [1.55, 2.4],
  }),
  football({
    id: 'f3',
    competition: 'Premier League',
    home: 'Tottenham',
    away: 'Newcastle',
    status: upcoming('Tomorrow · 15:00'),
    result: [2.1, 3.5, 3.3],
    goals: [1.72, 2.05],
    btts: [1.6, 2.25],
  }),
  football({
    id: 'f4',
    competition: 'LaLiga',
    home: 'Real Madrid',
    away: 'Barcelona',
    status: live("34'", '0', '0'),
    result: [2.2, 3.1, 3.4],
    goals: [2.1, 1.7],
    btts: [1.95, 1.8],
  }),
  football({
    id: 'f5',
    competition: 'LaLiga',
    home: 'Atlético Madrid',
    away: 'Sevilla',
    status: upcoming('Tomorrow · 21:00'),
    result: [1.75, 3.6, 4.8],
    goals: [2.2, 1.65],
    btts: [2.05, 1.72],
  }),
  football({
    id: 'f6',
    competition: 'Champions League',
    home: 'Bayern Munich',
    away: 'PSG',
    status: upcoming('Wed · 21:00'),
    result: [1.9, 3.9, 3.7],
    goals: [1.5, 2.55],
    btts: [1.48, 2.6],
  }),

  basketball({
    id: 'b1',
    competition: 'NBA',
    home: 'LA Lakers',
    away: 'Boston Celtics',
    status: live('Q3 · 4:12', '78', '84'),
    moneyline: [2.45, 1.55],
    spread: { line: 4.5, odds: [1.9, 1.9] },
    total: { line: 221.5, odds: [1.87, 1.93] },
  }),
  basketball({
    id: 'b2',
    competition: 'NBA',
    home: 'Golden State Warriors',
    away: 'Denver Nuggets',
    status: upcoming('Tomorrow · 01:30'),
    moneyline: [2.05, 1.78],
    spread: { line: 1.5, odds: [1.91, 1.89] },
    total: { line: 229.5, odds: [1.9, 1.9] },
  }),
  basketball({
    id: 'b3',
    competition: 'NBA',
    home: 'Milwaukee Bucks',
    away: 'New York Knicks',
    status: upcoming('Tomorrow · 00:30'),
    moneyline: [1.65, 2.25],
    spread: { line: -3.5, odds: [1.92, 1.88] },
    total: { line: 224.5, odds: [1.85, 1.95] },
  }),
  basketball({
    id: 'b4',
    competition: 'EuroLeague',
    home: 'Real Madrid',
    away: 'Olympiacos',
    status: live('Q2 · 6:40', '41', '38'),
    moneyline: [1.6, 2.35],
    spread: { line: -3.5, odds: [1.88, 1.92] },
    total: { line: 165.5, odds: [1.9, 1.9] },
  }),
  basketball({
    id: 'b5',
    competition: 'EuroLeague',
    home: 'Fenerbahçe',
    away: 'Panathinaikos',
    status: upcoming('Fri · 18:45'),
    moneyline: [1.85, 1.95],
    spread: { line: -1.5, odds: [1.9, 1.9] },
    total: { line: 162.5, odds: [1.87, 1.93] },
  }),

  tennis({
    id: 't1',
    competition: 'ATP Shanghai',
    home: 'Carlos Alcaraz',
    away: 'Jannik Sinner',
    status: live('Set 1', '5', '4'),
    winner: [1.4, 2.9],
    firstSet: [1.3, 3.4],
    games: { line: 22.5, odds: [1.75, 2.0] },
  }),
  tennis({
    id: 't2',
    competition: 'ATP Shanghai',
    home: 'Novak Djokovic',
    away: 'Alexander Zverev',
    status: upcoming('Today · 13:00'),
    winner: [1.7, 2.1],
    firstSet: [1.75, 2.0],
    games: { line: 22.5, odds: [1.83, 1.92] },
  }),
  tennis({
    id: 't3',
    competition: 'ATP Shanghai',
    home: 'Daniil Medvedev',
    away: 'Taylor Fritz',
    status: upcoming('Tomorrow · 10:30'),
    winner: [1.95, 1.83],
    firstSet: [1.9, 1.85],
    games: { line: 23.5, odds: [1.8, 1.95] },
  }),
  tennis({
    id: 't4',
    competition: 'WTA Wuhan',
    home: 'Aryna Sabalenka',
    away: 'Iga Świątek',
    status: live('Set 1', '3', '2'),
    winner: [1.65, 2.2],
    firstSet: [1.65, 2.15],
    games: { line: 21.5, odds: [1.85, 1.9] },
  }),
  tennis({
    id: 't5',
    competition: 'WTA Wuhan',
    home: 'Coco Gauff',
    away: 'Elena Rybakina',
    status: upcoming('Today · 12:00'),
    winner: [1.95, 1.83],
    firstSet: [1.9, 1.85],
    games: { line: 20.5, odds: [1.87, 1.88] },
  }),
];

export function getMatch(id: string): Match | undefined {
  return MATCHES.find((match) => match.id === id);
}

export function matchName(match: Match): string {
  return `${match.home} v ${match.away}`;
}

/** Groups matches by competition, keeping the order they first appear in. */
export function groupByCompetition(matches: Match[]): { competition: string; matches: Match[] }[] {
  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    groups.set(match.competition, [...(groups.get(match.competition) ?? []), match]);
  }
  return Array.from(groups, ([competition, matches]) => ({ competition, matches }));
}

export function toSelection(match: Match, market: Market, outcome: Outcome): Selection {
  return {
    outcomeId: outcome.id,
    matchId: match.id,
    matchName: matchName(match),
    marketName: market.name,
    outcomeLabel: outcome.label,
    odds: outcome.odds,
  };
}
