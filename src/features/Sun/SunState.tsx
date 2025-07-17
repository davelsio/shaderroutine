import {
  createContext,
  PropsWithChildren,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

export type SunPreset = {
  index: number;
  brightness: number;
  corona: string;
  glow: string;
  radius: number;
};

type State = {
  /**
   * Whether a custom preset has been defined by the user.
   */
  hasCustom: boolean;
  /**
   * Shader viewport height. Note that this is different from the `Canvas`
   * height.
   */
  height: SharedValue<number>;
  /**
   * Currently selected preset.
   */
  preset: SharedValue<SunPreset>;
  /**
   * Select a preset by its name. The `Custom` preset requires first to set its
   * values using the `updateCustom` method.
   * @param name preset name
   */
  selectPreset: (name: PresetName) => void;
  /**
   * Set or update the custom preset.
   * @param preset custom preset values
   */
  updateCustom: (preset: SunPreset) => void;
  /**
   * Shader viewport width. Note that this is different from the `Canvas` width.
   */
  width: SharedValue<number>;
};

export type PresetName = keyof typeof DEFAULT_PRESETS | 'Custom';

const SunContext = createContext<State | null>(null);

export function SunProvider({ children }: PropsWithChildren) {
  const { rt } = useUnistyles();

  const currPreset = useSharedValue<SunPreset>(DEFAULT_PRESETS.Sun);
  const nexPreset = useSharedValue<SunPreset>(DEFAULT_PRESETS.Sun);
  const customRef = useRef<SunPreset | undefined>(undefined);
  const [hasCustom, setHasCustom] = useState(false);

  const width = useSharedValue(rt.screen.width);
  const height = useSharedValue(rt.screen.height);

  const presetTransition = useSharedValue(0);

  /**
   * Animate preset selection.
   */
  useAnimatedReaction(
    () => presetTransition.value,
    (curr) => {
      const _corona = interpolateColor(
        curr,
        [0, 1],
        [currPreset.value.corona, nexPreset.value.corona]
      );

      const _glow = interpolateColor(
        curr,
        [0, 1],
        [currPreset.value.glow, nexPreset.value.glow]
      );

      const _brightness = interpolate(
        curr,
        [0, 1],
        [currPreset.value.brightness, nexPreset.value.brightness]
      );

      const _radius = interpolate(
        curr,
        [0, 1],
        [currPreset.value.radius, nexPreset.value.radius]
      );

      currPreset.value = {
        index: nexPreset.value.index,
        corona: _corona,
        glow: _glow,
        brightness: _brightness,
        radius: _radius,
      };
    }
  );

  /**
   * Select a preset and trigger the transition animation.
   */
  const selectPreset = useCallback(
    (name: PresetName) => {
      presetTransition.value = 0;
      let _nextPreset =
        name === 'Custom' ? customRef.current : DEFAULT_PRESETS[name];

      if (!_nextPreset) {
        return;
      }

      // presetTransition.value = withTiming(1, { duration: 300 });
      presetTransition.value = withSpring(1, {
        mass: 1,
        damping: 26,
        stiffness: 170,
        velocity: 0,
      });

      nexPreset.value = _nextPreset;
    },
    [nexPreset, presetTransition]
  );

  /**
   * Update and select the custom preset.
   */
  const updateCustom = useCallback(
    (preset: SunPreset) => {
      customRef.current = {
        ...preset,
        index: Object.keys(DEFAULT_PRESETS).length,
      };
      setHasCustom(true);
      selectPreset('Custom');
    },
    [selectPreset, setHasCustom]
  );

  /**
   * Stable context state reference.
   */
  const memoState = useMemo<State>(
    () => ({
      hasCustom,
      height,
      preset: currPreset,
      updateCustom,
      selectPreset,
      width,
    }),
    [hasCustom, height, currPreset, selectPreset, updateCustom, width]
  );

  return <SunContext value={memoState}>{children}</SunContext>;
}

export function useSunState() {
  const context = use(SunContext);
  if (!context) {
    throw new Error('Sun uniforms must be used within a SunProvider');
  }
  return context;
}

export const DEFAULT_PRESETS = {
  Sun: {
    index: 0,
    brightness: 0.5,
    corona: '#cca54c',
    glow: '#cc5919',
    radius: 0.25,
  },
  Neutron: {
    index: 1,
    brightness: 1.0,
    corona: '#4c5acc',
    glow: '#1963cc',
    radius: 0.3,
  },
  Dwarf: {
    index: 2,
    brightness: 0.5,
    corona: '#cc4c6a',
    glow: '#cc1919',
    radius: 0.1,
  },
  Retro: {
    index: 3,
    brightness: 0.5,
    corona: '#cc4c4c',
    glow: '#19a2cc',
    radius: 0.3,
  },
};
