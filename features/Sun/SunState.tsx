import { createContext, PropsWithChildren, use, useMemo } from 'react';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

export const PRESETS = ['Sun', 'Neutron', 'Dwarf', 'Custom'] as const;

export type SunPreset = {
  index: number;
  brightness: number;
  corona: string;
  glow: string;
  radius: number;
};

type State = {
  /**
   * Viewport height.
   */
  height: SharedValue<number>;
  /**
   * Preset.
   */
  preset: SharedValue<SunPreset>;
  /**
   * Viewport width.
   */
  width: SharedValue<number>;
};

export type PresetName = (typeof PRESETS)[number];

const SunContext = createContext<State | null>(null);

export function SunProvider({ children }: PropsWithChildren) {
  const { rt } = useUnistyles();

  const preset = useSharedValue<SunPreset>(DEFAULT_PRESETS.Sun);

  const width = useSharedValue(rt.screen.width);
  const height = useSharedValue(rt.screen.height);

  const memoState = useMemo<State>(
    () => ({
      height,
      preset,
      width,
    }),
    [width, height, preset]
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

export const PRESET_NAMES = ['Sun', 'Neutron', 'Dwarf', 'Custom'] as const;

export const DEFAULT_PRESETS: Record<PresetName, SunPreset> = {
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
  Custom: {
    index: 3,
    brightness: 0.5,
    corona: '#6d4ccc',
    glow: '#cc197b',
    radius: 0.25,
  },
};
