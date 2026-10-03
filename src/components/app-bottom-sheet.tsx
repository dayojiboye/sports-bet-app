import { BottomSheet, type BottomSheetProps } from '@expo/ui';
import { Platform } from 'react-native';

import { sheetTint } from '@/components/ui/modifiers';
import { Spacing } from '@/constants/theme';
import { useSheetColors } from '@/hooks/use-native-colors';

const CONTENT_PADDING = {
  // iOS overlays the drag indicator on the content; Android reserves space for it.
  top: Platform.OS === 'ios' ? Spacing.five : 0,
  bottom: Spacing.four,
  left: Spacing.four,
  right: Spacing.four,
};

/**
 * `BottomSheet` with the app's padding, brand tint (iOS) and palette colors (Android). Render
 * it as a sibling of the screen's `AppHost`, not inside it: the sheet creates its own `Host`.
 */
export function AppBottomSheet(props: BottomSheetProps) {
  const sheetColors = useSheetColors();

  return (
    <BottomSheet
      contentPadding={CONTENT_PADDING}
      modifiers={sheetTint}
      {...sheetColors}
      {...props}
    />
  );
}
