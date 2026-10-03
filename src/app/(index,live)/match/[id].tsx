import { Column, FieldGroup, Row, Spacer, Text } from '@expo/ui';
import { Stack, useLocalSearchParams } from 'expo-router';

import { AppHost } from '@/components/app-host';
import { MatchStatusText } from '@/components/match-row';
import { OddsButton } from '@/components/odds-button';
import { stretch } from '@/components/ui/modifiers';
import { Spacing, Typography } from '@/constants/theme';
import { getMatch } from '@/data/matches';
import type { Match } from '@/data/types';

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const match = getMatch(id);

  if (!match) {
    return (
      <AppHost>
        <FieldGroup>
          <FieldGroup.Section>
            <Text>This match is no longer available.</Text>
          </FieldGroup.Section>
        </FieldGroup>
      </AppHost>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: match.competition }} />
      <AppHost>
        <FieldGroup>
          <FieldGroup.Section>
            <Scoreboard match={match} />
          </FieldGroup.Section>

          {match.markets.map((market) => (
            <FieldGroup.Section key={market.id} title={market.name}>
              {market.outcomes.map((outcome) => (
                <Row key={outcome.id} alignment="center" spacing={Spacing.three}>
                  <Text numberOfLines={1}>{outcome.label}</Text>
                  <Spacer flexible />
                  <OddsButton match={match} market={market} outcome={outcome} />
                </Row>
              ))}
            </FieldGroup.Section>
          ))}
        </FieldGroup>
      </AppHost>
    </>
  );
}

function Scoreboard({ match }: { match: Match }) {
  const title = { ...Typography.title, textAlign: 'center' } as const;

  return (
    <Column alignment="center" spacing={Spacing.two} modifiers={stretch.fullWidth}>
      <MatchStatusText status={match.status} />
      <Text textStyle={title}>{match.home}</Text>
      <Text textStyle={title}>
        {match.status.state === 'live' ? match.status.score.join('  –  ') : 'v'}
      </Text>
      <Text textStyle={title}>{match.away}</Text>
    </Column>
  );
}
