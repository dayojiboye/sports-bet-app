import { FieldGroup } from '@expo/ui';

import { AppHost } from '@/components/app-host';
import { MatchRow } from '@/components/match-row';
import { MATCHES, SPORTS } from '@/data/matches';

const LIVE_BY_SPORT = SPORTS.map((sport) => ({
  sport,
  matches: MATCHES.filter((match) => match.sport === sport.id && match.status.state === 'live'),
})).filter(({ matches }) => matches.length > 0);

export default function LiveScreen() {
  return (
    <AppHost>
      <FieldGroup>
        {LIVE_BY_SPORT.map(({ sport, matches }) => (
          <FieldGroup.Section key={sport.id} title={`${sport.name} · ${matches.length} live`}>
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} showCompetition />
            ))}
          </FieldGroup.Section>
        ))}
      </FieldGroup>
    </AppHost>
  );
}
