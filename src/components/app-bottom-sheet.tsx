import { BottomSheet, type BottomSheetProps } from '@expo/ui';
import { Platform } from 'react-native';

import { sheetTint } from '@/components/ui/modifiers';
import { Spacing } from '@/constants/theme';

const CONTENT_PADDING = {
  // iOS overlays the drag indicator on the content; Android reserves space for it.
  top: Platform.OS === 'ios' ? Spacing.five : 0,
  bottom: Spacing.four,
  left: Spacing.four,
  right: Spacing.four,
};

/**
 * `BottomSheet` with the app's padding and brand tint. Render it as a sibling of the
 * screen's `AppHost`, not inside it: the sheet creates its own `Host`.
 */
export function AppBottomSheet(props: BottomSheetProps) {
  return <BottomSheet contentPadding={CONTENT_PADDING} modifiers={sheetTint} {...props} />;
}
