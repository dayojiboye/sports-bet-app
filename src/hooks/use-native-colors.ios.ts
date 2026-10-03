import type { BottomSheetProps } from '@expo/ui';
import type { NativeTabsProps } from 'expo-router/unstable-native-tabs';

/* iOS version of `use-native-colors.ts`: the system tab bar and sheets adapt on their own. */

export function useTabBarColors(): Partial<NativeTabsProps> {
  return {};
}

export function useSheetColors(): Pick<BottomSheetProps, 'containerColor' | 'contentColor'> {
  return {};
}
