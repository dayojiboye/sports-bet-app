import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/constants/navigation';

export default function MyBetsLayout() {
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="my-bets" options={{ title: 'My Bets' }} />
    </Stack>
  );
}
