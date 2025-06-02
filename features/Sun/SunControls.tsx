import { View } from 'react-native';
import ColorPicker, {
  type ColorFormatsObject,
  HueSlider,
  Preview,
} from 'reanimated-color-picker';
import {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useCallback, useRef, useState } from 'react';
import { Picker, type PickerProps } from '@expo/ui/swift-ui';

import { Text } from '@typography/Text';

import styles from './Sun.styles';
import { useSunState } from './SunState';

const PRESETS = ['Sun', 'Neutron', 'Dwarf', 'Custom'];

type PresetEvent = Parameters<NonNullable<PickerProps['onOptionSelected']>>[0];
type CustomColors = { corona?: string; glow?: string };

interface PresetParams extends PresetEvent {
  picker?: CustomColors;
}

export function SunControlsView() {
  const state = useSunState();

  const [preset, setPreset] = useState(() => state.preset.get().index);
  const customRef = useRef<{ corona: string; glow: string }>({
    corona: '#6d4ccc',
    glow: '#cc197b',
  });
  const [corona, setCorona] = useState(() => state.preset.get().corona);
  const [glow, setGlow] = useState(() => state.preset.get().glow);

  const colorTransition = useSharedValue(0);

  useAnimatedReaction(
    () => colorTransition.value,
    (curr) => {
      const _corona = interpolateColor(
        curr,
        [0, 1],
        [state.preset.value.corona, corona]
      );

      const _glow = interpolateColor(
        curr,
        [0, 1],
        [state.preset.value.glow, glow]
      );

      state.preset.value = {
        index: preset,
        corona: _corona,
        glow: _glow,
      };
    }
  );

  const updatePreset = useCallback(
    ({ nativeEvent, picker }: PresetParams) => {
      let { corona, glow } = state.preset.get();
      const custom = customRef.current;

      switch (nativeEvent.label) {
        case 'Sun':
          corona = '#cca54c';
          glow = '#cc5919';
          break;
        case 'Neutron':
          corona = '#4c5acc';
          glow = '#1963cc';
          break;
        case 'Dwarf':
          corona = '#cc4c6a';
          glow = '#cc1919';
          break;
        case 'Custom':
          customRef.current = {
            corona: picker?.corona ?? custom.corona,
            glow: picker?.glow ?? custom.glow,
          };
          corona = customRef.current.corona;
          glow = customRef.current.glow;
          break;
      }

      if (picker) {
        colorTransition.value = 1;
      } else {
        colorTransition.value = 0;
        colorTransition.value = withTiming(1, { duration: 300 });
      }

      setCorona(corona);
      setGlow(glow);
      setPreset(nativeEvent.index);
    },
    [colorTransition, state.preset]
  );

  const onCoronaPickerUpdate = useCallback(
    (color: ColorFormatsObject, finished: boolean) => {
      'worklet';
      state.preset.value.corona = color.hex;
      if (finished) {
        runOnJS(updatePreset)({
          nativeEvent: { index: 3, label: 'Custom' },
          picker: { corona: color.hex, glow: state.preset.value.glow },
        });
      }
    },
    [state.preset, updatePreset]
  );

  const onGlowPickerUpdate = useCallback(
    (color: ColorFormatsObject, finished: boolean) => {
      'worklet';
      state.preset.value.glow = color.hex;
      if (finished) {
        runOnJS(updatePreset)({
          nativeEvent: { index: 3, label: 'Custom' },
          picker: { corona: state.preset.value.corona, glow: color.hex },
        });
      }
    },
    [state.preset, updatePreset]
  );

  return (
    <View style={styles.controls}>
      <Picker
        variant="segmented"
        options={PRESETS}
        selectedIndex={preset}
        onOptionSelected={updatePreset}
      />
      <InlineColorPicker
        label="Corona"
        value={corona}
        onUpdate={onCoronaPickerUpdate}
      />
      <InlineColorPicker
        label="Glow"
        value={glow}
        onUpdate={onGlowPickerUpdate}
      />
    </View>
  );
}

type InlineColorPickerProps = {
  label: string;
  value: string;
  onUpdate: (color: ColorFormatsObject, finished: boolean) => void;
};

function InlineColorPicker({ label, onUpdate, value }: InlineColorPickerProps) {
  const updateValue = useCallback(
    (colors: ColorFormatsObject) => {
      'worklet';
      onUpdate(colors, false);
    },
    [onUpdate]
  );

  const refreshValue = useCallback(
    (color: ColorFormatsObject) => {
      'worklet';
      onUpdate(color, true);
    },
    [onUpdate]
  );

  return (
    <View style={styles.picker}>
      <Text variant="headline">{label}</Text>
      <ColorPicker
        style={styles.hueSlider}
        thumbSize={25}
        value={value}
        onChange={updateValue}
        onComplete={refreshValue}
      >
        <Preview style={{ width: '25%' }} hideInitialColor />
        <HueSlider />
      </ColorPicker>
    </View>
  );
}
