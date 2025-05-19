import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { ThemeProvider } from '@theme/Provider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
