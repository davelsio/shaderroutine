import { Stack } from 'expo-router';

import { SunProvider } from '@features/Sun';

export default function SunLayout() {
  return (
    <SunProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="controls"
          options={{
            animation: 'slide_from_bottom',
            gestureDirection: 'vertical',
            presentation: 'formSheet',
            sheetLargestUndimmedDetentIndex: 0,
            sheetGrabberVisible: false,
            sheetInitialDetentIndex: 0,
            sheetAllowedDetents: 'fitToContents',
          }}
        />
      </Stack>
    </SunProvider>
  );
}
