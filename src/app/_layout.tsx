import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { BrandColor } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NativeTabs tintColor={BrandColor}>
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
    </ThemeProvider>
  );
}
