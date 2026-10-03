import { FieldGroup } from '@expo/ui';
import { useState } from 'react';

import { AppHost } from '@/components/app-host';
import { ChipGroup, type ChipOption } from '@/components/chip-group';
import { SportIcons } from '@/components/icons';
import { MatchRow } from '@/components/match-row';
import { groupByCompetition, MATCHES, SPORTS } from '@/data/matches';
import type { Sport } from '@/data/types';

const SPORT_OPTIONS: ChipOption<Sport>[] = SPORTS.map((sport) => ({
  value: sport.id,
  label: sport.name,
  icon: SportIcons[sport.id],
}));

export default function SportsScreen() {
  const [sport, setSport] = useState<Sport>('football');
  const competitions = groupByCompetition(MATCHES.filter((match) => match.sport === sport));

  return (
    <AppHost>
      <FieldGroup>
        <FieldGroup.Section>
          <ChipGroup options={SPORT_OPTIONS} value={sport} onChange={setSport} />
        </FieldGroup.Section>

        {competitions.map(({ competition, matches }) => (
          <FieldGroup.Section key={competition} title={competition}>
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </FieldGroup.Section>
        ))}
      </FieldGroup>
    </AppHost>
  );
}
