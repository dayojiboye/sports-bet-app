import type { NativeStackNavigationOptions } from 'expo-router/native-stack';

/** Header options shared by every tab's stack. */
export const tabStackScreenOptions: NativeStackNavigationOptions = {
  headerLargeTitleEnabled: true,
  headerShadowVisible: false,
  headerLargeTitleShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
};
