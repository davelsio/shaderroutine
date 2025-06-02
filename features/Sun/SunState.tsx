import { createContext, PropsWithChildren, use, useMemo } from 'react';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

export const PRESETS = ['Sun', 'Neutron', 'Dwarf', 'Custom'] as const;

type Preset = {
  index: number;
  corona: string;
  glow: string;
};

type State = {
  /**
   * Viewport height.
   */
  height: SharedValue<number>;
  /**
   * Preset.
   */
  preset: SharedValue<Preset>;
  /**
   * Viewport width.
   */
  width: SharedValue<number>;
};

const SunContext = createContext<State | null>(null);

export function SunProvider({ children }: PropsWithChildren) {
  const { rt } = useUnistyles();

  const preset = useSharedValue<Preset>({
    index: 0,
    corona: '#cca54c',
    glow: '#cc5919',
  });

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
