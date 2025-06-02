import { SkColor, Skia } from '@shopify/react-native-skia';
import { createContext, PropsWithChildren, use, useMemo } from 'react';
import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

type State = {
  /**
   * Corona and halo color.
   */
  corona: SharedValue<SkColor>;
  /**
   * Glow color.
   */
  glow: SharedValue<SkColor>;
  /**
   * Viewport height.
   */
  height: SharedValue<number>;
  /**
   * Viewport width.
   */
  width: SharedValue<number>;
};

const SunContext = createContext<State | null>(null);

export function SunProvider({ children }: PropsWithChildren) {
  const { rt } = useUnistyles();

  const corona = useSharedValue(Skia.Color('#cca54c'));
  const glow = useSharedValue(Skia.Color('#cc5919'));

  const width = useDerivedValue(() => rt.screen.width);
  const height = useDerivedValue(() => rt.screen.height);

  const memoState = useMemo<State>(
    () => ({
      corona,
      glow,
      height,
      width,
    }),
    [width, height, corona, glow]
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
