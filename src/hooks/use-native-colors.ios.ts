import type { NativeTabsProps } from 'expo-router/unstable-native-tabs';

/* iOS version of `use-native-colors.ts`: the system tab bar adapts on its own. */

export function useTabBarColors(): Partial<NativeTabsProps> {
  return {};
}
