import type { UniversalTextStyle } from '@expo/ui';

/**
 * Brand color. Seeds the Material 3 palette on Android and the SwiftUI tint on iOS
 * (see `AppHost`), and tints the native tab bar.
 */
export const BrandColor = '#16A34A';

/**
 * Accent colors that the native toolkits don't provide. Primary text, backgrounds and
 * control colors come from SwiftUI / Material 3 and adapt to light and dark mode on their own.
 */
export const Colors = {
  light: {
    textSecondary: '#6B7280',
    live: '#DC2626',
    won: '#16A34A',
    lost: '#DC2626',
  },
  dark: {
    textSecondary: '#9CA3AF',
    live: '#F87171',
    won: '#4ADE80',
    lost: '#F87171',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Typography = {
  caption: { fontSize: 12 },
  footnote: { fontSize: 13 },
  body: { fontSize: 16 },
  headline: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 22, fontWeight: '700' },
  odds: { fontSize: 15, fontWeight: '700' },
} as const satisfies Record<string, UniversalTextStyle>;
