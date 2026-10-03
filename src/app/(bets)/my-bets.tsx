import { Column, FieldGroup, Row, Spacer, Text } from '@expo/ui';
import { useState } from 'react';

import { AppBottomSheet } from '@/components/app-bottom-sheet';
import { AppHost } from '@/components/app-host';
import { ChipGroup } from '@/components/chip-group';
import { FullWidthButton } from '@/components/full-width-button';
import { stretch } from '@/components/ui/modifiers';
import { ValueRow } from '@/components/value-row';
import { BrandColor, Spacing, Typography } from '@/constants/theme';
import type { Bet, BetStatus } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { useBetting } from '@/store/betting';
import { betTitle, cashOutOffer, potentialReturn } from '@/utils/bets';
import { formatDateTime, formatMoney } from '@/utils/format';

type Filter = 'open' | 'settled';

export default function MyBetsScreen() {
  const theme = useTheme();
  const { bets, cashOut, formatOdds } = useBetting();
  const [filter, setFilter] = useState<Filter>('open');
  const [cashOutBet, setCashOutBet] = useState<Bet>();
  const [isCashOutPresented, setIsCashOutPresented] = useState(false);

  const openBets = bets.filter((bet) => bet.status === 'open');
  const settledBets = bets.filter((bet) => bet.status !== 'open');
  const visibleBets = filter === 'open' ? openBets : settledBets;

  return (
    <>
      <AppHost>
        <FieldGroup>
          <FieldGroup.Section>
            <ChipGroup
              options={[
                { value: 'open', label: `Open (${openBets.length})` },
                { value: 'settled', label: `Settled (${settledBets.length})` },
              ]}
              value={filter}
              onChange={setFilter}
            />
          </FieldGroup.Section>

          {visibleBets.length === 0 ? (
            <FieldGroup.Section>
              <Text textStyle={{ color: theme.textSecondary }}>
                {filter === 'open'
                  ? 'No open bets. Add selections from Sports or Live.'
                  : 'No settled bets yet.'}
              </Text>
            </FieldGroup.Section>
          ) : null}

          {visibleBets.map((bet) => (
            <FieldGroup.Section key={bet.id} title={`${betTitle(bet)} · ${formatOdds(bet.odds)}`}>
              <BetStatusLabel status={bet.status} />
              {bet.selections.map((selection) => (
                <Row key={selection.outcomeId} alignment="center" spacing={Spacing.two}>
                  <Column spacing={Spacing.half}>
                    <Text textStyle={Typography.headline}>{selection.outcomeLabel}</Text>
                    <Text textStyle={{ ...Typography.footnote, color: theme.textSecondary }}>
                      {`${selection.marketName} · ${selection.matchName}`}
                    </Text>
                  </Column>
                  <Spacer flexible />
                  <Text textStyle={Typography.odds}>{formatOdds(selection.odds)}</Text>
                </Row>
              ))}
              <ValueRow label="Stake" value={formatMoney(bet.stake)} />
              {bet.status === 'open' ? (
                <>
                  <ValueRow
                    label="Potential return"
                    value={formatMoney(potentialReturn(bet.stake, bet.odds))}
                    valueColor={theme.won}
                    bold
                  />
                  <FullWidthButton
                    label={`Cash out ${formatMoney(cashOutOffer(bet))}`}
                    variant="outlined"
                    onPress={() => {
                      setCashOutBet(bet);
                      setIsCashOutPresented(true);
                    }}
                  />
                </>
              ) : (
                <ValueRow
                  label="Returned"
                  value={formatMoney(bet.payout ?? 0)}
                  valueColor={bet.status === 'won' ? theme.won : undefined}
                  bold
                />
              )}
              <FieldGroup.SectionFooter>
                <Text textStyle={{ ...Typography.footnote, color: theme.textSecondary }}>
                  {`Placed ${formatDateTime(bet.placedAt)}`}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
          ))}
        </FieldGroup>
      </AppHost>

      <AppBottomSheet
        isPresented={isCashOutPresented}
        onDismiss={() => setIsCashOutPresented(false)}>
        {cashOutBet ? (
          <Column spacing={Spacing.three} modifiers={stretch.fullWidth}>
            <Text textStyle={Typography.title}>Cash out?</Text>
            <Text textStyle={{ color: theme.textSecondary }}>
              Settle this bet now instead of waiting for the result.
            </Text>
            <ValueRow label="Stake" value={formatMoney(cashOutBet.stake)} />
            <ValueRow
              label="Potential return"
              value={formatMoney(potentialReturn(cashOutBet.stake, cashOutBet.odds))}
            />
            <ValueRow
              label="Cash out now"
              value={formatMoney(cashOutOffer(cashOutBet))}
              valueColor={theme.won}
              bold
            />
            <FullWidthButton
              label="Confirm cash out"
              onPress={() => {
                cashOut(cashOutBet);
                setIsCashOutPresented(false);
              }}
            />
            <FullWidthButton
              label="Keep bet"
              variant="text"
              onPress={() => setIsCashOutPresented(false)}
            />
          </Column>
        ) : null}
      </AppBottomSheet>
    </>
  );
}

const STATUS_LABELS: Record<BetStatus, string> = {
  open: 'OPEN',
  won: 'WON',
  lost: 'LOST',
  cashedOut: 'CASHED OUT',
};

function BetStatusLabel({ status }: { status: BetStatus }) {
  const theme = useTheme();
  const colors: Record<BetStatus, string> = {
    open: BrandColor,
    won: theme.won,
    lost: theme.lost,
    cashedOut: theme.textSecondary,
  };

  return (
    <Text textStyle={{ ...Typography.caption, fontWeight: '700', color: colors[status] }}>
      {STATUS_LABELS[status]}
    </Text>
  );
}
