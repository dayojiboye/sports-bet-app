import { Button, Column, Text } from '@expo/ui';

import { stretch } from '@/components/ui/stretch';
import { Spacing, Typography } from '@/constants/theme';
import type { Market, Match, Outcome } from '@/data/types';
import { useBetting } from '@/store/betting';

type OddsButtonProps = {
  match: Match;
  market: Market;
  outcome: Outcome;
  /** Shown above the price, e.g. "1", "X" or "Over 2.5". */
  label?: string;
  /** Share the parent `Row` equally with sibling buttons. */
  fill?: boolean;
};

/** Price button that adds the outcome to (or removes it from) the bet slip. */
export function OddsButton({ match, market, outcome, label, fill = false }: OddsButtonProps) {
  const { isSelected, toggleSelection, formatOdds } = useBetting();

  return (
    <Button
      variant={isSelected(outcome.id) ? 'filled' : 'outlined'}
      onPress={() => toggleSelection(match, market, outcome)}
      modifiers={fill ? stretch.rowButton : undefined}>
      <Column
        alignment="center"
        spacing={Spacing.half}
        modifiers={fill ? stretch.buttonContent : undefined}>
        {label ? (
          <Text textStyle={Typography.caption} numberOfLines={1} style={{ opacity: 0.8 }}>
            {label}
          </Text>
        ) : null}
        <Text textStyle={Typography.odds}>{formatOdds(outcome.odds)}</Text>
      </Column>
    </Button>
  );
}
