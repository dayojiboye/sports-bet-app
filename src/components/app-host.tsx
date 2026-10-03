import { Host, type UniversalHostProps } from '@expo/ui';
import { StyleSheet } from 'react-native';

import { BrandColor } from '@/constants/theme';

/**
 * Screen-level `Host` for Expo UI trees. Fills the screen and applies the brand seed color
 * so SwiftUI / Material 3 controls are themed consistently.
 */
export function AppHost({ style, ...props }: UniversalHostProps) {
  return <Host seedColor={BrandColor} style={[styles.fill, style]} {...props} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
