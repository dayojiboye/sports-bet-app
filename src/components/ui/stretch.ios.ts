import type { UniversalBaseProps } from '@expo/ui';
import { controlSize, frame } from '@expo/ui/swift-ui/modifiers';

type Modifiers = NonNullable<UniversalBaseProps['modifiers']>;

/** iOS version of `stretch.ts`. */
export const stretch: Record<'rowButton' | 'fullWidthButton' | 'buttonContent', Modifiers> = {
  rowButton: [],
  fullWidthButton: [controlSize('large')],
  buttonContent: [frame({ maxWidth: Infinity })],
};
