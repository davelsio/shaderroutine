import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Shader Routine',
  slug: 'shaderroutine',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'com.davelsan.shaderroutine',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.davelsan.shaderroutine',
    icon: {
      dark: './assets/images/icon-ios-dark.png',
      light: './assets/images/icon-ios-light.png',
      tinted: './assets/images/icon-ios-tinted.png',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
      // backgroundImage: './assets/images/adaptive-icon-background.png',
    },
    package: 'com.davelsan.shaderroutine',
  },
  plugins: [
    [
      'expo-asset',
      {
        assets: ['./assets/images'],
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './node_modules/@expo-google-fonts/nunito/300Light/Nunito_300Light.ttf',
          './node_modules/@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf',
          './node_modules/@expo-google-fonts/nunito/500Medium/Nunito_500Medium.ttf',
          './node_modules/@expo-google-fonts/nunito/600SemiBold/Nunito_600SemiBold.ttf',
          './node_modules/@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf',
          './node_modules/@expo-google-fonts/nunito/900Black/Nunito_900Black.ttf',
          './node_modules/@expo-google-fonts/space-mono/400Regular/SpaceMono_400Regular.ttf',
        ],
      },
    ],
    'expo-router',
    [
      'expo-splash-screen',
      {
        ios: {
          image: './assets/images/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          imageWidth: 200,
          dark: {
            image: './assets/images/splash-dark.png',
            backgroundColor: '#000000',
          },
        },
        android: {
          image: './assets/images/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          imageWidth: 150,
          dark: {
            image: './assets/images/splash-dark.png',
            backgroundColor: '#000000',
          },
        },
      },
    ],
    'expo-web-browser',
    [
      'react-native-edge-to-edge',
      {
        android: {
          parentTheme: 'Default',
          enforceNavigationBarContrast: false,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
