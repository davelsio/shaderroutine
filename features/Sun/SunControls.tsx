import { View } from 'react-native';
import { interpolateColor, runOnJS } from 'react-native-reanimated';
import { useCallback, useMemo, useState } from 'react';

import {
  BrightnessSlider,
  ColorFormatsObject,
  colorKit,
  ColorPicker,
  HueSlider,
  PreviewLabel,
} from '@components/ColorPicker';
import { Slider } from '@components/Slider';

import styles from './Sun.styles';
import { type SunPreset, useSunState } from './SunState';

export function SunControlsView() {
  const state = useSunState();
  const [preset, setPreset] = useState<SunPreset>(() => state.preset.get());

  const refreshPreset = useCallback(() => {
    'worklet';
    runOnJS(setPreset)(state.preset.value);
    runOnJS(state.updateCustom)(state.preset.value);
  }, [state.preset, state.updateCustom]);

  const onCoronaPickerUpdate = useCallback(
    (color: ColorFormatsObject) => {
      'worklet';
      state.preset.value = {
        ...state.preset.value,
        corona: color.hex,
      };
    },
    [state.preset]
  );

  const onGlowPickerUpdate = useCallback(
    (color: ColorFormatsObject) => {
      'worklet';
      state.preset.value = {
        ...state.preset.value,
        glow: color.hex,
      };
    },
    [state.preset]
  );

  const onBrightnessChange = useCallback(
    (color: ColorFormatsObject) => {
      'worklet';
      const match = color.hsv.match(/[\d.]+/g);
      if (!match) return;
      const opacity = Number(match[match.length - 1]) / 100;
      state.preset.value = {
        ...state.preset.value,
        brightness: opacity,
      };
    },
    [state.preset]
  );

  const bColor = useMemo(() => {
    const mix = interpolateColor(
      0.5,
      [0, 1],
      [preset.corona, preset.glow],
      'HSV'
    );

    const hsv = colorKit
      .setBrightness(mix, preset.brightness * 100)
      .hsv()
      .string();

    return hsv;
  }, [preset]);

  const onRadiusChange = useCallback(
    (value: number) => {
      'worklet';
      state.preset.value = {
        ...state.preset.value,
        radius: value,
      };
    },
    [state.preset]
  );

  return (
    <View style={styles.controls}>
      <ColorPicker
        value={preset.corona}
        onChange={onCoronaPickerUpdate}
        onComplete={refreshPreset}
      >
        <PreviewLabel label="Corona" />
        <HueSlider boundedThumb />
      </ColorPicker>

      <ColorPicker
        value={preset.glow}
        onChange={onGlowPickerUpdate}
        onComplete={refreshPreset}
      >
        <PreviewLabel label="Glow" />
        <HueSlider boundedThumb />
      </ColorPicker>

      <ColorPicker
        value={bColor}
        onChange={onBrightnessChange}
        onComplete={refreshPreset}
      >
        <PreviewLabel label="Brightness" preview={false} />
        <BrightnessSlider adaptSpectrum />
      </ColorPicker>

      <Slider
        // Appearance
        label="Radius"
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#FFFFFF60"
        // Data
        value={preset.radius}
        onValueChange={onRadiusChange}
        onSlidingComplete={refreshPreset}
        // Behavior
        lowerLimit={0.1}
        upperLimit={1}
        minimumValue={0}
        maximumValue={1}
      />
    </View>
  );
}
