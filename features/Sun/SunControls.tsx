import { View } from 'react-native';
import ColorPicker, {
  type ColorFormatsObject,
  HueSlider,
  OpacitySlider,
  Preview,
  colorKit,
} from 'reanimated-color-picker';
import {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Picker, type PickerProps } from '@expo/ui/swift-ui';

import { Text } from '@typography/Text';

import styles from './Sun.styles';
import {
  DEFAULT_PRESETS,
  type PresetName,
  type SunPreset,
  useSunState,
} from './SunState';

type PresetEvent = Parameters<NonNullable<PickerProps['onOptionSelected']>>[0];

interface PresetParams extends PresetEvent {
  custom?: SunPreset;
}

export function SunControlsView() {
  const state = useSunState();

  const [preset, setPreset] = useState<SunPreset>(() => state.preset.get());
  const customRef = useRef<SunPreset>(DEFAULT_PRESETS.Custom);

  const presetTransition = useSharedValue(0);

  useAnimatedReaction(
    () => presetTransition.value,
    (curr) => {
      const _corona = interpolateColor(
        curr,
        [0, 1],
        [state.preset.value.corona, preset.corona]
      );

      const _glow = interpolateColor(
        curr,
        [0, 1],
        [state.preset.value.glow, preset.glow]
      );

      const _brightness = interpolate(
        curr,
        [0, 1],
        [state.preset.value.brightness, preset.brightness]
      );

      const _radius = interpolate(
        curr,
        [0, 1],
        [state.preset.value.radius, preset.radius]
      );

      state.preset.value = {
        index: preset.index,
        corona: _corona,
        glow: _glow,
        brightness: _brightness,
        radius: _radius,
      };
    }
  );

  const updatePreset = useCallback(
    ({ nativeEvent, custom }: PresetParams) => {
      let nextPreset = DEFAULT_PRESETS[nativeEvent.label as PresetName]!;

      if (nativeEvent.label === 'Custom') {
        const _custom = custom ?? customRef.current;
        customRef.current = {
          ..._custom,
          index: nativeEvent.index,
        };
        nextPreset = customRef.current;
      }

      if (!custom) {
        presetTransition.value = 0;
        // presetTransition.value = withTiming(1, { duration: 300 });
        presetTransition.value = withSpring(1, {
          mass: 1,
          damping: 26,
          stiffness: 170,
          velocity: 0,
        });
      }

      setPreset(nextPreset);
    },
    [presetTransition]
  );

  const onCoronaPickerUpdate = useCallback(
    (color: ColorFormatsObject, finished: boolean) => {
      'worklet';
      state.preset.value.corona = color.hex;
      if (finished) {
        runOnJS(updatePreset)({
          nativeEvent: { index: 3, label: 'Custom' },
          custom: {
            ...state.preset.value,
            corona: color.hex,
          },
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
          custom: {
            ...state.preset.value,
            glow: color.hex,
          },
        });
      }
    },
    [state.preset, updatePreset]
  );

  const onBrightnessChange = useCallback(
    (color: ColorFormatsObject, finished: boolean) => {
      'worklet';
      const match = color.rgba.match(/[\d.]+/g);
      if (!match) return;
      state.preset.value.brightness = Number(match[match.length - 1]);
      if (finished) {
        runOnJS(updatePreset)({
          nativeEvent: { index: 3, label: 'Custom' },
          custom: {
            ...state.preset.value,
            brightness: state.preset.value.brightness,
          },
        });
      }
    },
    [state.preset, updatePreset]
  );

  const bColor = useMemo(() => {
    const mix = interpolateColor(0.5, [0, 1], [preset.corona, preset.glow]);
    return colorKit.setAlpha(mix, preset.brightness).hex();
  }, [preset]);

  return (
    <View style={styles.controls}>
      {/* PRESETS */}
      <Picker
        variant="segmented"
        options={Object.keys(DEFAULT_PRESETS)}
        selectedIndex={preset.index}
        onOptionSelected={updatePreset}
      />

      {/* CORONA */}
      <InlineSlider
        label="Corona"
        value={preset.corona}
        onUpdate={onCoronaPickerUpdate}
      >
        <HueSlider boundedThumb />
      </InlineSlider>

      {/* GLOW */}
      <InlineSlider
        label="Glow"
        value={preset.glow}
        onUpdate={onGlowPickerUpdate}
      >
        <HueSlider boundedThumb />
      </InlineSlider>

      {/* BRIGHTNESS */}
      <InlineSlider
        label="Brightness"
        value={bColor}
        onUpdate={onBrightnessChange}
        preview={false}
      >
        <OpacitySlider boundedThumb />
      </InlineSlider>
    </View>
  );
}

type InlineColorPickerProps = {
  label: string;
  value: string;
  onUpdate: (color: ColorFormatsObject, finished: boolean) => void;
  preview?: boolean;
};

function InlineSlider({
  children,
  label,
  onUpdate,
  preview = true,
  value,
}: PropsWithChildren<InlineColorPickerProps>) {
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
      <ColorPicker
        style={styles.hueSlider}
        thumbSize={25}
        value={value}
        onChange={updateValue}
        onComplete={refreshValue}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text variant="headline">{label}</Text>
          {preview && <Preview style={styles.sliderPreview} hideInitialColor />}
        </View>
        {children}
      </ColorPicker>
    </View>
  );
}
