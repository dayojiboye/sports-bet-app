import { Column, Row, Spacer, Text } from '@expo/ui';
import { router } from 'expo-router';

import { OddsButton } from '@/components/odds-button';
import { Spacing, Typography } from '@/constants/theme';
import type { Match, MatchStatus } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';

type MatchRowProps = {
  match: Match;
  /** Show the competition name, for lists that mix competitions. */
  showCompetition?: boolean;
};

/**
 * Match summary with live score and the main market's prices. Tapping the summary opens the
 * match's full market list.
 */
export function MatchRow({ match, showCompetition = false }: MatchRowProps) {
  const theme = useTheme();
  const [mainMarket] = match.markets;
  const score = match.status.state === 'live' ? match.status.score : undefined;
  const secondaryCaption = { ...Typography.caption, color: theme.textSecondary };

  return (
    <Column spacing={Spacing.three}>
      <Column
        spacing={Spacing.one}
        onPress={() => router.push({ pathname: '/match/[id]', params: { id: match.id } })}>
        <Row alignment="center" spacing={Spacing.one}>
          <MatchStatusText status={match.status} />
          {showCompetition ? (
            <Text textStyle={secondaryCaption} numberOfLines={1}>
              {`· ${match.competition}`}
            </Text>
          ) : null}
          <Spacer flexible />
          <Text textStyle={secondaryCaption}>{`${match.markets.length} markets ›`}</Text>
        </Row>
        <TeamLine name={match.home} score={score?.[0]} />
        <TeamLine name={match.away} score={score?.[1]} />
      </Column>

      <Row spacing={Spacing.two}>
        {mainMarket.outcomes.map((outcome) => (
          <OddsButton
            key={outcome.id}
            match={match}
            market={mainMarket}
            outcome={outcome}
            label={outcome.shortLabel}
            fill
          />
        ))}
      </Row>
    </Column>
  );
}

export function MatchStatusText({ status }: { status: MatchStatus }) {
  const theme = useTheme();

  if (status.state === 'live') {
    return (
      <Text textStyle={{ ...Typography.caption, fontWeight: '700', color: theme.live }}>
        {`● LIVE  ${status.clock}`}
      </Text>
    );
  }
  return (
    <Text textStyle={{ ...Typography.caption, color: theme.textSecondary }}>{status.startsAt}</Text>
  );
}

function TeamLine({ name, score }: { name: string; score?: string }) {
  return (
    <Row alignment="center" spacing={Spacing.two}>
      <Text textStyle={Typography.headline} numberOfLines={1}>
        {name}
      </Text>
      <Spacer flexible />
      {score ? <Text textStyle={Typography.headline}>{score}</Text> : null}
    </Row>
  );
}
