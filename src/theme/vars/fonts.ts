import { Platform } from 'react-native';

export type Mono = {
  family: 'SpaceMono';
  face: 'Regular';
};

export type Sans = {
  family: 'Nunito';
  face: 'Black' | 'Bold' | 'SemiBold' | 'Medium' | 'Regular' | 'Light';
};

export type Font = Mono | Sans;
export type FontFamily = Font['family'];
export type ExtractFace<Family extends Font['family']> = Family extends 'Nunito'
  ? Sans['face']
  : Mono['face'];

export function font<Family extends FontFamily>(
  family: Family,
  face: ExtractFace<Family>
) {
  const fontFace = faces?.[face];
  if (!fontFace) {
    return;
  }
  return family + fontFace;
}

/**
 * Platform-specific font naming.
 * @see https://docs.expo.dev/develop/user-interface/fonts/#use-google-fonts
 * @see https://github.com/expo/expo/issues/26540
 */
const faces = Platform.select({
  android: {
    Black: '_900Black',
    Bold: '_700Bold',
    SemiBold: '_600SemiBold',
    Medium: '_500Medium',
    Regular: '_400Regular',
    Light: '_300Light',
  },
  ios: {
    Black: '-Black',
    Bold: '-Bold',
    SemiBold: '-SemiBold',
    Medium: '-Medium',
    Regular: '-Regular',
    Light: '-Light',
  },
} as const);
