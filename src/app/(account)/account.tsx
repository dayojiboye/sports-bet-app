import {
  Button,
  Column,
  FieldGroup,
  Icon,
  Picker,
  Row,
  Slider,
  Spacer,
  Switch,
  Text,
} from '@expo/ui';
import { useState, type ReactNode } from 'react';
import { Alert, Platform } from 'react-native';

import { AppBottomSheet } from '@/components/app-bottom-sheet';
import { AppHost } from '@/components/app-host';
import { FullWidthButton } from '@/components/full-width-button';
import { AccountIcon } from '@/components/icons';
import { stretch } from '@/components/ui/modifiers';
import { ValueRow } from '@/components/value-row';
import { BrandColor, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useBetting } from '@/store/betting';
import { formatMoney } from '@/utils/format';

type WalletAction = 'deposit' | 'withdraw';

const AMOUNT_STEP = 1_000;
const MAX_DEPOSIT = 200_000;

export default function AccountScreen() {
  const theme = useTheme();
  const { balance, deposit, withdraw, oddsFormat, setOddsFormat } = useBetting();

  const [walletAction, setWalletAction] = useState<WalletAction>('deposit');
  const [isWalletSheetPresented, setIsWalletSheetPresented] = useState(false);
  const [amount, setAmount] = useState(10_000);

  const [notifications, setNotifications] = useState({
    betSettled: true,
    kickOff: true,
    promotions: false,
  });
  const [acceptOddsChanges, setAcceptOddsChanges] = useState(true);
  const [realityCheck, setRealityCheck] = useState(true);
  const [weeklyLimit, setWeeklyLimit] = useState(100_000);

  const maxWithdrawal = Math.floor(balance / AMOUNT_STEP) * AMOUNT_STEP;
  const maxAmount = walletAction === 'deposit' ? MAX_DEPOSIT : maxWithdrawal;

  function openWalletSheet(action: WalletAction) {
    const max = action === 'deposit' ? MAX_DEPOSIT : maxWithdrawal;
    setWalletAction(action);
    setAmount((current) => Math.min(current, max));
    setIsWalletSheetPresented(true);
  }

  function confirmWalletAction() {
    if (walletAction === 'deposit') {
      deposit(amount);
    } else {
      withdraw(amount);
    }
    setIsWalletSheetPresented(false);
  }

  return (
    <>
      <AppHost>
        <FieldGroup>
          <FieldGroup.Section>
            <Row alignment="center" spacing={Spacing.three}>
              <Icon name={AccountIcon} size={48} color={BrandColor} />
              <Column spacing={Spacing.half}>
                <Text textStyle={Typography.headline}>Demo User</Text>
                <Text textStyle={{ ...Typography.footnote, color: theme.textSecondary }}>
                  demo@example.com
                </Text>
              </Column>
            </Row>
          </FieldGroup.Section>

          <FieldGroup.Section title="Wallet">
            <ValueRow label="Balance" value={formatMoney(balance)} bold />
            <Row spacing={Spacing.two}>
              <Button onPress={() => openWalletSheet('deposit')} modifiers={stretch.rowItem}>
                <Text modifiers={stretch.buttonContent}>Deposit</Text>
              </Button>
              <Button
                variant="outlined"
                disabled={maxWithdrawal === 0}
                onPress={() => openWalletSheet('withdraw')}
                modifiers={stretch.rowItem}>
                <Text modifiers={stretch.buttonContent}>Withdraw</Text>
              </Button>
            </Row>
          </FieldGroup.Section>

          <FieldGroup.Section title="Betting">
            <LabeledControl label="Odds format">
              <Picker selectedValue={oddsFormat} onValueChange={setOddsFormat}>
                <Picker.Item label="Decimal (2.50)" value="decimal" />
                <Picker.Item label="Fractional (3/2)" value="fractional" />
                <Picker.Item label="American (+150)" value="american" />
              </Picker>
            </LabeledControl>
            <Switch
              label="Accept odds changes"
              value={acceptOddsChanges}
              onValueChange={setAcceptOddsChanges}
            />
          </FieldGroup.Section>

          <FieldGroup.Section title="Notifications">
            <Switch
              label="Bet settled"
              value={notifications.betSettled}
              onValueChange={(betSettled) => setNotifications((n) => ({ ...n, betSettled }))}
            />
            <Switch
              label="Match kick-off"
              value={notifications.kickOff}
              onValueChange={(kickOff) => setNotifications((n) => ({ ...n, kickOff }))}
            />
            <Switch
              label="Promotions"
              value={notifications.promotions}
              onValueChange={(promotions) => setNotifications((n) => ({ ...n, promotions }))}
            />
          </FieldGroup.Section>

          <FieldGroup.Section title="Responsible gambling">
            <Column spacing={Spacing.two}>
              <ValueRow label="Weekly deposit limit" value={formatMoney(weeklyLimit)} />
              <Slider
                value={weeklyLimit}
                onValueChange={setWeeklyLimit}
                min={10_000}
                max={500_000}
                step={10_000}
              />
            </Column>
            <Switch
              label="Reality check every hour"
              value={realityCheck}
              onValueChange={setRealityCheck}
            />
            <FieldGroup.SectionFooter>
              <Text textStyle={{ ...Typography.footnote, color: theme.textSecondary }}>
                This is a demo app. No real money is involved.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          <FieldGroup.Section>
            <Button
              variant="text"
              label="Log out"
              onPress={() => Alert.alert('Log out', 'There is no real account in this demo.')}
            />
          </FieldGroup.Section>
        </FieldGroup>
      </AppHost>

      <AppBottomSheet
        isPresented={isWalletSheetPresented}
        onDismiss={() => setIsWalletSheetPresented(false)}>
        <Column spacing={Spacing.three} modifiers={stretch.fullWidth}>
          <Text textStyle={Typography.title}>
            {walletAction === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}
          </Text>
          <Column alignment="center" spacing={Spacing.one} modifiers={stretch.fullWidth}>
            <Text textStyle={{ fontSize: 34, fontWeight: '700' }}>{formatMoney(amount)}</Text>
            <Text textStyle={{ ...Typography.footnote, color: theme.textSecondary }}>
              {`Balance after: ${formatMoney(
                walletAction === 'deposit' ? balance + amount : balance - amount
              )}`}
            </Text>
          </Column>
          <Slider
            value={amount}
            onValueChange={setAmount}
            min={AMOUNT_STEP}
            max={Math.max(maxAmount, AMOUNT_STEP)}
            step={AMOUNT_STEP}
          />
          <FullWidthButton
            label={walletAction === 'deposit' ? 'Deposit' : 'Withdraw'}
            disabled={amount > maxAmount}
            onPress={confirmWalletAction}
          />
          <FullWidthButton
            label="Cancel"
            variant="text"
            onPress={() => setIsWalletSheetPresented(false)}
          />
        </Column>
      </AppBottomSheet>
    </>
  );
}

/**
 * Label beside a control on iOS (settings style). Android's dropdown is a full-width text
 * field, so the label goes above it.
 */
function LabeledControl({ label, children }: { label: string; children: ReactNode }) {
  if (Platform.OS === 'ios') {
    return (
      <Row alignment="center" spacing={Spacing.two}>
        <Text>{label}</Text>
        <Spacer flexible />
        {children}
      </Row>
    );
  }
  return (
    <Column spacing={Spacing.two}>
      <Text>{label}</Text>
      {children}
    </Column>
  );
}
