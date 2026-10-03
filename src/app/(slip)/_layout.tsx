import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/constants/navigation';

export default function BetSlipLayout() {
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="bet-slip" options={{ title: 'Bet Slip' }} />
    </Stack>
  );
}
