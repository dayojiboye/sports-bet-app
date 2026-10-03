import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/constants/navigation';

// The Sports and Live tabs each get their own copy of this stack, so both can push shared
// screens (match details) while keeping separate histories.
export const unstable_settings = {
  index: { anchor: 'index' },
  live: { anchor: 'live' },
};

export default function MatchesLayout({ segment }: { segment: string }) {
  const isLive = segment === '(live)';

  return (
    <Stack screenOptions={tabStackScreenOptions}>
      {isLive ? (
        <Stack.Screen name="live" options={{ title: 'Live' }} />
      ) : (
        <Stack.Screen name="index" options={{ title: 'Sports' }} />
      )}
    </Stack>
  );
}
