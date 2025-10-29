import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Shader Routine',
  slug: 'shaderroutine',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './src/assets/app/icon.png',
  scheme: 'com.davelsio.shaderroutine',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.davelsio.shaderroutine',
    icon: {
      dark: './src/assets/app/icon_ios_dark.png',
      light: './src/assets/app/icon_ios_light.png',
      tinted: './src/assets/app/icon_ios_tinted.png',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/app/adaptive_icon.png',
      backgroundColor: '#ffffff',
      // backgroundImage: './assets/app/adaptive-icon-background.png',
    },
    package: 'com.davelsio.shaderroutine',
  },
  plugins: [
    [
      'expo-asset',
      {
        assets: ['./src/assets/app', './src/assets/textures'],
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
          image: './src/assets/app/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          imageWidth: 200,
          dark: {
            image: './src/assets/app/splash_dark.png',
            backgroundColor: '#000000',
          },
        },
        android: {
          image: './src/assets/app/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          imageWidth: 150,
          dark: {
            image: './src/assets/app/splash_dark.png',
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
