import type { UniversalBaseProps } from '@expo/ui';
import { fillMaxWidth, weight } from '@expo/ui/jetpack-compose/modifiers';

type Modifiers = NonNullable<UniversalBaseProps['modifiers']>;

/**
 * Modifiers for stretching views, which the universal `style` prop can't express
 * (it only takes fixed sizes). Android version; see `stretch.ios.ts`.
 *
 * For buttons, Compose stretches the button itself while SwiftUI stretches the button's
 * content so the bezel grows with it. Apply both halves: one to the `Button`,
 * `buttonContent` to its child.
 */
export const stretch: Record<
  'rowButton' | 'fullWidthButton' | 'buttonContent' | 'fullWidth',
  Modifiers
> = {
  /** A button sharing its `Row` equally with its siblings. */
  rowButton: [weight(1)],
  /** A button spanning its container. */
  fullWidthButton: [fillMaxWidth()],
  buttonContent: [],
  /** Any other view spanning its container, e.g. to center a `Column` in a row. */
  fullWidth: [fillMaxWidth()],
};
