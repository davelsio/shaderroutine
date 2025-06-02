import { View } from 'react-native';
import ColorPicker, {
  type ColorFormatsObject,
  HueSlider,
} from 'reanimated-color-picker';
import { type SkColor, Skia } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { useCallback, useState } from 'react';

import { Text } from '@typography/Text';

import styles from './Sun.styles';
import { useSunState } from './SunState';

export function SunControlsView() {
  const state = useSunState();

  return (
    <View style={styles.controls}>
      <InlineColorPicker label="Corona" value={state.corona} />
      <InlineColorPicker label="Glow" value={state.glow} />
    </View>
  );
}

type InlineColorPickerProps = {
  label: string;
  value: SharedValue<SkColor>;
};

function InlineColorPicker({ label, value }: InlineColorPickerProps) {
  const [initialColor] = useState(() => {
    const color = value.get();
    const r = Math.floor(color[0] * 255);
    const g = Math.floor(color[1] * 255);
    const b = Math.floor(color[2] * 255);
    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  });

  const updateValue = useCallback(
    (colors: ColorFormatsObject) => {
      'worklet';
      value.value = Skia.Color(colors.hex);
    },
    [value]
  );

  return (
    <View style={styles.picker}>
      <Text variant="headline">{label}</Text>
      <ColorPicker
        style={styles.hueSlider}
        thumbSize={25}
        value={initialColor}
        onChange={updateValue}
      >
        <HueSlider />
      </ColorPicker>
    </View>
  );
}
