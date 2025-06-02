import { View } from 'react-native';
import ColorPicker, {
  type ColorFormatsObject,
  HueSlider,
  Preview,
} from 'reanimated-color-picker';
import { Skia } from '@shopify/react-native-skia';
import { runOnJS } from 'react-native-reanimated';
import { useCallback, useState } from 'react';
import { Picker, type PickerProps } from '@expo/ui/swift-ui';

import { Text } from '@typography/Text';
import { colorToHex } from '@helpers/skia/convertColor';

import styles from './Sun.styles';
import { useSunState } from './SunState';

const PRESETS = ['Sun', 'Neutron', 'Dwarf', 'Custom'];

export function SunControlsView() {
  const state = useSunState();
  const [preset, setPreset] = useState(0);
  const [corona, setCorona] = useState(() => colorToHex(state.corona));
  const [glow, setGlow] = useState(() => colorToHex(state.glow));

  const updatePreset = useCallback(
    ({
      nativeEvent: { index, label },
    }: Parameters<NonNullable<PickerProps['onOptionSelected']>>[0]) => {
      let corona = state.corona.get();
      let glow = state.glow.get();

      switch (label) {
        case 'Sun':
          corona = Skia.Color('#cca54c');
          glow = Skia.Color('#cc5919');
          break;
        case 'Neutron':
          corona = Skia.Color('#4c5acc');
          glow = Skia.Color('#1963cc');
          break;
        case 'Dwarf':
          corona = Skia.Color('#cc4c6a');
          glow = Skia.Color('#cc1919');
          break;
        case 'Custom':
          break;
      }

      state.corona.value = corona;
      state.glow.value = glow;

      setCorona(colorToHex(corona));
      setGlow(colorToHex(glow));
      setPreset(index);
    },
    [state.corona, state.glow, setPreset]
  );

  const onCoronaPickerUpdate = useCallback(
    (color: ColorFormatsObject, finished: boolean) => {
      'worklet';
      state.corona.value = Skia.Color(color.hex);
      if (finished) {
        runOnJS(updatePreset)({ nativeEvent: { index: 3, label: 'Custom' } });
      }
    },
    [state.corona, updatePreset]
  );

  const onGlowPickerUpdate = useCallback(
    (color: ColorFormatsObject, finished: boolean) => {
      'worklet';
      state.glow.value = Skia.Color(color.hex);
      if (finished) {
        runOnJS(updatePreset)({ nativeEvent: { index: 3, label: 'Custom' } });
      }
    },
    [state.glow, updatePreset]
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
