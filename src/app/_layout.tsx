import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { BrandColor } from '@/constants/theme';
import { useTabBarColors } from '@/hooks/use-native-colors';
import { BettingProvider, useBetting } from '@/store/betting';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BettingProvider>
        <AppTabs />
      </BettingProvider>
    </ThemeProvider>
  );
}

function AppTabs() {
  const { selections } = useBetting();
  const tabBarColors = useTabBarColors();

  return (
    <NativeTabs tintColor={BrandColor} {...tabBarColors}>
      <NativeTabs.Trigger name="(index)">
        <NativeTabs.Trigger.Icon sf="sportscourt.fill" md="sports" />
        <NativeTabs.Trigger.Label>Sports</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(live)">
        <NativeTabs.Trigger.Icon sf="dot.radiowaves.left.and.right" md="sensors" />
        <NativeTabs.Trigger.Label>Live</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(slip)">
        <NativeTabs.Trigger.Icon sf="ticket.fill" md="receipt_long" />
        <NativeTabs.Trigger.Label>Bet Slip</NativeTabs.Trigger.Label>
        {/* Rendered conditionally: `hidden` is ignored when the badge has text. */}
        {selections.length > 0 ? (
          <NativeTabs.Trigger.Badge>{String(selections.length)}</NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(bets)">
        <NativeTabs.Trigger.Icon sf="clock.arrow.circlepath" md="history" />
        <NativeTabs.Trigger.Label>My Bets</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(account)">
        <NativeTabs.Trigger.Icon sf="person.crop.circle.fill" md="account_circle" />
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
