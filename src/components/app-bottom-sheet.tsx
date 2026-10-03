import { BottomSheet, Column, type BottomSheetProps } from '@expo/ui';
import { Platform } from 'react-native';

import { sheetTint, stretch } from '@/components/ui/modifiers';
import { Spacing } from '@/constants/theme';

// Added on top of the sheet's built-in 16pt inset. iOS overlays the drag indicator on the
// content, so it needs extra space at the top; Android reserves space for its handle.
const CONTENT_PADDING = {
  paddingTop: Platform.OS === 'ios' ? Spacing.three : 0,
  paddingBottom: Spacing.four,
  paddingHorizontal: Spacing.two,
};

/**
 * `BottomSheet` with the app's padding and brand tint (iOS). Render it as a sibling of the
 * screen's `AppHost`, not inside it: the sheet creates its own `Host`.
 */
export function AppBottomSheet({ children, ...props }: BottomSheetProps) {
  return (
    <BottomSheet modifiers={sheetTint} {...props}>
      <Column style={CONTENT_PADDING} modifiers={stretch.fullWidth}>
        {children}
      </Column>
    </BottomSheet>
  );
}
