import { Row } from '@expo/ui';
import { animated, graphicsLayer, tween } from '@expo/ui/jetpack-compose/modifiers';
import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

// Android version; see `live-dot.ios.tsx`. Compose modifiers can only animate between two
// values, so a shared timer flips the target and Compose runs each fade natively.

const HALF_PULSE_MS = 800;
const DOT_SIZE = 7;
const FADE = tween({ durationMillis: HALF_PULSE_MS, easing: 'ease' });

const listeners = new Set<() => void>();
let dimmed = false;
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  timer ??= setInterval(() => {
    dimmed = !dimmed;
    listeners.forEach((notify) => notify());
  }, HALF_PULSE_MS);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const subscribeNever = () => () => {};

/** Pulsing dot for live badges. Every dot on screen shares one timer, so they pulse in sync. */
export function LiveDot({ color }: { color: string }) {
  const reducedMotion = useReducedMotion();
  const isDimmed = useSyncExternalStore(reducedMotion ? subscribeNever : subscribe, () =>
    reducedMotion ? false : dimmed
  );

  return (
    // The fade sits on a wrapper: a graphicsLayer only affects what is drawn inside it.
    <Row
      modifiers={[graphicsLayer({ alpha: animated(isDimmed ? 0.25 : 1, FADE) })]}>
      <Row
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
          backgroundColor: color,
        }}
      />
    </Row>
  );
}
