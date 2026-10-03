import { useMaterialColors } from '@expo/ui/jetpack-compose';
import type { NativeTabsProps } from 'expo-router/unstable-native-tabs';

import { BrandColor } from '@/constants/theme';

// Android version; see `use-native-colors.ios.ts`. Colors come from the same seeded Material 3
// palette as `AppHost`, and the hook re-renders when the color scheme changes, so the tab bar
// switches to dark mode together with the screens instead of after a reload.

/** The default tab bar colors are resolved once and never re-themed; these follow the scheme. */
export function useTabBarColors(): Partial<NativeTabsProps> {
  const palette = useMaterialColors({ seedColor: BrandColor });

  return {
    backgroundColor: palette.surfaceContainer,
    indicatorColor: palette.secondaryContainer,
    iconColor: palette.onSurfaceVariant,
    labelStyle: { color: palette.onSurfaceVariant },
  };
}
