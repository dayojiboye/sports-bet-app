import { Host, type UniversalHostProps } from '@expo/ui';
import { StyleSheet, useColorScheme } from 'react-native';

import { BrandColor } from '@/constants/theme';

/**
 * Screen-level `Host` for Expo UI trees. Fills the screen and applies the brand seed color
 * so SwiftUI / Material 3 controls are themed consistently.
 */
export function AppHost({ style, ...props }: UniversalHostProps) {
  // Pass the scheme explicitly. Left to itself, the native theme on Android can miss a
  // dark-mode switch while the app runs, while JS-drawn backgrounds (FieldGroup rows) do
  // switch, leaving dark text on dark rows until a reload.
  const scheme = useColorScheme();
  const colorScheme = scheme === 'light' || scheme === 'dark' ? scheme : undefined;

  return (
    <Host
      seedColor={BrandColor}
      colorScheme={colorScheme}
      style={[styles.fill, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
