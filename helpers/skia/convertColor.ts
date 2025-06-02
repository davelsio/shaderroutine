import { SkColor } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

import { resolveValue } from './isSharedValue';

export function colorToHex(color: SkColor | SharedValue<SkColor>) {
  const value = resolveValue(color);

  const r = Math.floor(value[0]! * 255).toString(16);
  const g = Math.floor(value[1]! * 255).toString(16);
  const b = Math.floor(value[2]! * 255).toString(16);

  return `#${r}${g}${b}`;
}
