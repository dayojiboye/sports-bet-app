import type { UniversalBaseProps } from '@expo/ui';
import { controlSize, frame, tint } from '@expo/ui/swift-ui/modifiers';

import { BrandColor } from '@/constants/theme';

type Modifiers = NonNullable<UniversalBaseProps['modifiers']>;

/* iOS version of `modifiers.ts`. */

export const stretch: Record<
  'rowItem' | 'fullWidthButton' | 'buttonContent' | 'fullWidth',
  Modifiers
> = {
  rowItem: [],
  fullWidthButton: [controlSize('large')],
  buttonContent: [frame({ maxWidth: Infinity })],
  fullWidth: [frame({ maxWidth: Infinity })],
};

export const sheetTint: Modifiers = [tint(BrandColor)];
