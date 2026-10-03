import { Button, Column, FieldGroup, Icon, Row, Spacer, Text, TextInput } from '@expo/ui';
import { router } from 'expo-router';
import { useState } from 'react';

import { AppBottomSheet } from '@/components/app-bottom-sheet';
import { AppHost } from '@/components/app-host';
import { FullWidthButton } from '@/components/full-width-button';
import { BetSlipIcon, CloseIcon, SuccessIcon } from '@/components/icons';
import { stretch } from '@/components/ui/modifiers';
import { ValueRow } from '@/components/value-row';
import { Spacing, Typography } from '@/constants/theme';
import type { Bet, Selection } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { useBetting } from '@/store/betting';
import { betTitle, combinedOdds, potentialReturn } from '@/utils/bets';
import { formatMoney } from '@/utils/format';

const QUICK_STAKES = [
  { amount: 500, label: '+₦500' },
  { amount: 1_000, label: '+₦1k' },
  { amount: 5_000, label: '+₦5k' },
];

export default function BetSlipScreen() {
  const theme = useTheme();
  const { selections, balance, clearSelections, placeBet, formatOdds } = useBetting();

  const [stake, setStake] = useState(0);
  // The stake field is uncontrolled. Changing its key remounts it with `stake` as the
  // default value, which is how quick stakes and placing a bet update it.
  const [stakeInputKey, setStakeInputKey] = useState(0);
  const [receipt, setReceipt] = useState<Bet>();
  const [isReceiptPresented, setIsReceiptPresented] = useState(false);

  const odds = combinedOdds(selections);
  const exceedsBalance = stake > balance;
  const slipTitle = `${betTitle({ selections })} · ${selections.length} selected`;

  function updateStake(value: number) {
    setStake(Math.round(value * 100) / 100);
    setStakeInputKey((key) => key + 1);
  }

  function handlePlaceBet() {
    setReceipt(placeBet(stake));
    setIsReceiptPresented(true);
    updateStake(0);
  }

  return (
    <>
      <AppHost>
        <FieldGroup>
          {selections.length === 0 ? (
            <FieldGroup.Section>
              <Column alignment="center" spacing={Spacing.two} modifiers={stretch.fullWidth}>
                <Icon name={BetSlipIcon} size={40} color={theme.textSecondary} />
                <Text textStyle={Typography.headline}>Your bet slip is empty</Text>
                <Text textStyle={{ ...Typography.footnote, color: theme.textSecondary }}>
                  Tap any price to add it here.
                </Text>
              </Column>
            </FieldGroup.Section>
          ) : (
            <>
              <FieldGroup.Section title={slipTitle}>
                {selections.map((selection) => (
                  <SelectionRow key={selection.outcomeId} selection={selection} />
                ))}
                <Button variant="text" label="Remove all" onPress={clearSelections} />
              </FieldGroup.Section>

              <FieldGroup.Section title="Stake">
                <Row alignment="center" spacing={Spacing.two}>
                  <Text textStyle={Typography.title}>₦</Text>
                  <TextInput
                    key={stakeInputKey}
                    defaultValue={stake > 0 ? String(stake) : undefined}
                    onChangeText={(text) => setStake(Number(text.replace(/,/g, '')) || 0)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    textStyle={Typography.title}
                    modifiers={stretch.rowItem}
                  />
                </Row>
                <Row spacing={Spacing.two}>
                  {QUICK_STAKES.map(({ amount, label }) => (
                    <Button
                      key={amount}
                      variant="outlined"
                      onPress={() => updateStake(stake + amount)}
                      modifiers={stretch.rowItem}>
                      <Text modifiers={stretch.buttonContent}>{label}</Text>
                    </Button>
                  ))}
                </Row>
              </FieldGroup.Section>

              <FieldGroup.Section>
                <ValueRow label="Total odds" value={formatOdds(odds)} bold />
                <ValueRow
                  label="Potential return"
                  value={formatMoney(potentialReturn(stake, odds))}
                  valueColor={theme.won}
                  bold
                />
                <ValueRow
                  label="Balance"
                  value={formatMoney(balance)}
                  valueColor={exceedsBalance ? theme.lost : theme.textSecondary}
                />
                <FullWidthButton
                  label={stake > 0 ? `Place bet · ${formatMoney(stake)}` : 'Enter a stake'}
                  onPress={handlePlaceBet}
                  disabled={stake <= 0 || exceedsBalance}
                />
                {exceedsBalance ? (
                  <Text textStyle={{ ...Typography.footnote, color: theme.lost }}>
                    Your stake is more than your balance. Deposit funds from Account.
                  </Text>
                ) : null}
              </FieldGroup.Section>
            </>
          )}
        </FieldGroup>
      </AppHost>

      <AppBottomSheet
        isPresented={isReceiptPresented}
        onDismiss={() => setIsReceiptPresented(false)}>
        {receipt ? (
          <Column alignment="center" spacing={Spacing.three} modifiers={stretch.fullWidth}>
            <Icon name={SuccessIcon} size={56} color={theme.won} />
            <Text textStyle={Typography.title}>Bet placed</Text>
            <Text textStyle={{ color: theme.textSecondary }}>
              {`${betTitle(receipt)} at ${formatOdds(receipt.odds)}`}
            </Text>
            <ValueRow label="Stake" value={formatMoney(receipt.stake)} />
            <ValueRow
              label="Potential return"
              value={formatMoney(potentialReturn(receipt.stake, receipt.odds))}
              valueColor={theme.won}
              bold
            />
            <FullWidthButton
              label="View my bets"
              onPress={() => {
                setIsReceiptPresented(false);
                router.navigate('/my-bets');
              }}
            />
            <FullWidthButton
              label="Done"
              variant="text"
              onPress={() => setIsReceiptPresented(false)}
            />
          </Column>
        ) : null}
      </AppBottomSheet>
    </>
  );
}

function SelectionRow({ selection }: { selection: Selection }) {
  const theme = useTheme();
  const { removeSelection, formatOdds } = useBetting();
  const secondary = { ...Typography.footnote, color: theme.textSecondary };

  return (
    <Row alignment="center" spacing={Spacing.two}>
      <Column spacing={Spacing.half}>
        <Text textStyle={Typography.headline}>{selection.outcomeLabel}</Text>
        <Text textStyle={secondary}>{selection.marketName}</Text>
        <Text textStyle={secondary}>{selection.matchName}</Text>
      </Column>
      <Spacer flexible />
      <Text textStyle={Typography.odds}>{formatOdds(selection.odds)}</Text>
      <Button variant="text" onPress={() => removeSelection(selection.outcomeId)}>
        <Icon name={CloseIcon} size={20} color={theme.textSecondary} />
      </Button>
    </Row>
  );
}
