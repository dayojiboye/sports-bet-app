import { Stack } from 'expo-router';

import { tabStackScreenOptions } from '@/constants/navigation';

export default function AccountLayout() {
  return (
    <Stack screenOptions={tabStackScreenOptions}>
      <Stack.Screen name="account" options={{ title: 'Account' }} />
    </Stack>
  );
}
