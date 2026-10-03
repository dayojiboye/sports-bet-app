import type { UniversalBaseProps } from '@expo/ui';
import { fillMaxWidth, weight } from '@expo/ui/jetpack-compose/modifiers';

type Modifiers = NonNullable<UniversalBaseProps['modifiers']>;

/*
 * Platform modifiers for things the universal props can't express. Android version; see
 * `modifiers.ios.ts`. Importing `@expo/ui/jetpack-compose` or `@expo/ui/swift-ui` on the
 * wrong platform crashes, so platform-specific modifiers live only in these two files.
 */

/**
 * Stretches views (the universal `style` prop only takes fixed sizes).
 *
 * For buttons, Compose stretches the button itself while SwiftUI stretches the button's
 * content so the bezel grows with it. Apply both halves: one to the `Button`,
 * `buttonContent` to its child.
 */
export const stretch: Record<
  'rowItem' | 'fullWidthButton' | 'buttonContent' | 'fullWidth',
  Modifiers
> = {
  /** A view (usually a button) sharing its `Row` equally with its siblings. */
  rowItem: [weight(1)],
  /** A button spanning its container. */
  fullWidthButton: [fillMaxWidth()],
  buttonContent: [],
  /** Any other view spanning its container, e.g. to center a `Column` in a row. */
  fullWidth: [fillMaxWidth()],
};

/**
 * Brand tint for `BottomSheet` content, which renders in its own `Host` without the
 * `AppHost` seed color. On Android the sheet keeps the system Material palette.
 */
export const sheetTint: Modifiers = [];
