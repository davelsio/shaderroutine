import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { interpolateColor } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  BrightnessSlider,
  ColorFormatsObject,
  colorKit,
  ColorPicker,
  HueSlider,
  PreviewLabel,
} from '../../components/ColorPicker';
import { Slider } from '../../components/Slider';
import { useSunState, type SunPreset } from './SunState';

import styles from './Sun.styles';

export function SunControlsView() {
  const state = useSunState();
  const [preset, setPreset] = useState<SunPreset>(() => state.preset.get());

  const refreshPreset = () => {
    'worklet';
    scheduleOnRN(setPreset, state.preset.value);
    scheduleOnRN(state.updateCustom, state.preset.value);
  };

  const onCoronaPickerUpdate = (color: ColorFormatsObject) => {
    'worklet';
    state.preset.set({
      ...state.preset.value,
      corona: color.hex,
    });
  };

  const onGlowPickerUpdate = (color: ColorFormatsObject) => {
    'worklet';
    state.preset.set({
      ...state.preset.value,
      glow: color.hex,
    });
  };

  const onBrightnessChange = (color: ColorFormatsObject) => {
    'worklet';
    const match = color.hsv.match(/[\d.]+/g);
    if (!match) return;
    const opacity = Number(match[match.length - 1]) / 100;
    state.preset.set({
      ...state.preset.value,
      brightness: opacity,
    });
  };

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

  const onRadiusChange = (value: number) => {
    'worklet';
    state.preset.set({
      ...state.preset.value,
      radius: value,
    });
  };

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
