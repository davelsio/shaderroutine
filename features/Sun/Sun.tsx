import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  type SkColor,
  Skia,
  type SkPoint,
  useClock,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import {
  runOnJS,
  useDerivedValue,
  withSpring,
  type WithSpringConfig,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router, usePathname } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

import { useShader } from '@hooks/useShader';
import { remap } from '@shaders/remap';
import type { ShaderModule } from '@shaders/modules';

import styles from './Sun.styles';
import { useSunState } from './SunState';

type Uniforms = {
  /**
   * Sun brightness.
   */
  uBrightness: number;
  /**
   * Corona color.
   */
  uCorona: SkColor;
  /**
   * Glow color.
   */
  uGlow: SkColor;
  /**
   * Sun radius in normalized y-axis units.
   */
  uRadius: number;
  /**
   * Image resolution.
   */
  uResolution: SkPoint;
  /**
   * Time in seconds.
   */
  uTime: number;
};

const sunSkShader: ShaderModule = {
  module: require('./Sun.sksl'),
  dependencies: [remap],
};

export function SunView() {
  const pathname = usePathname();
  const state = useSunState();
  const time = useClock();
  const { rt } = useUnistyles();

  const uniforms = useDerivedValue<Uniforms>(() => ({
    uBrightness: state.preset.value.brightness,
    uCorona: Skia.Color(state.preset.value.corona),
    uGlow: Skia.Color(state.preset.value.glow),
    uRadius: state.preset.value.radius,
    uResolution: vec(state.width.value, state.height.value),
    uTime: time.value / 1000,
  }));

  const surface = useImage(require('@assets/textures/sun.png'));

  const { shader } = useShader(sunSkShader);
  const skShader = useMemo(
    () => (shader ? Skia.RuntimeEffect.Make(shader) : null),
    [shader]
  );

  if (!skShader) {
    return null;
  }

  const gesture = Gesture.Tap().onStart(() => {
    const springConfig: WithSpringConfig = {
      mass: 1,
      damping: 26, // friction
      stiffness: 170, // tension
      velocity: 0,
    };

    if (pathname === '/sun') {
      state.height.value = withSpring(rt.screen.height / 1.3, springConfig);
      runOnJS(router.navigate)('/sun/controls');
    } else {
      state.height.value = withSpring(rt.screen.height, springConfig);
      runOnJS(router.dismissAll)();
    }
  });

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={styles.canvas}>
        <Fill>
          <Shader source={skShader} uniforms={uniforms}>
            <ImageShader
              image={surface}
              fit="fill"
              width={state.width}
              height={state.height}
              tx="repeat"
              ty="repeat"
            />
          </Shader>
        </Fill>
      </Canvas>
    </GestureDetector>
  );
}
