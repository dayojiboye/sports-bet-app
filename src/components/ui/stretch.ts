import type { UniversalBaseProps } from '@expo/ui';
import { fillMaxWidth, weight } from '@expo/ui/jetpack-compose/modifiers';

type Modifiers = NonNullable<UniversalBaseProps['modifiers']>;

/**
 * Modifiers for stretching buttons, which the universal `style` prop can't express
 * (it only takes fixed sizes). Android version; see `stretch.ios.ts`.
 *
 * Compose stretches the button itself; SwiftUI stretches the button's content so the bezel
 * grows with it. Apply both halves: one to the `Button`, `buttonContent` to its child.
 */
export const stretch: Record<'rowButton' | 'fullWidthButton' | 'buttonContent', Modifiers> = {
  /** A button sharing its `Row` equally with its siblings. */
  rowButton: [weight(1)],
  /** A button spanning its container. */
  fullWidthButton: [fillMaxWidth()],
  buttonContent: [],
};
