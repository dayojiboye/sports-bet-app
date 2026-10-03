import { Icon } from '@expo/ui';
import { symbolEffect } from '@expo/ui/swift-ui/modifiers';
import { useReducedMotion } from 'react-native-reanimated';

const PULSE = [symbolEffect({ effect: 'pulse' }, { options: { repeat: 'continuous' } })];

/** Pulsing dot for live badges: the SF Symbols pulse effect, run natively by SwiftUI. */
export function LiveDot({ color }: { color: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <Icon
      name="circle.fill"
      size={7}
      color={color}
      modifiers={reducedMotion ? undefined : PULSE}
    />
  );
}
