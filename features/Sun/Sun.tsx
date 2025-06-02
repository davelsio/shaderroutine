import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  useClock,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { runOnJS, useDerivedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router, usePathname } from 'expo-router';

import { useShader } from '@hooks/useShader';
import { remap } from '@shaders/remap';
import type { ShaderModule } from '@shaders/modules';

import styles from './Sun.styles';
import { useSunState } from './SunState';

const sunSkShader: ShaderModule = {
  module: require('./Sun.sksl'),
  dependencies: [remap],
};

export function SunView() {
  const pathname = usePathname();
  const state = useSunState();
  const time = useClock();

  const uniforms = useDerivedValue(() => ({
    uCorona: state.corona.value,
    uGlow: state.glow.value,
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
    if (pathname === '/sun') {
      runOnJS(router.navigate)('/sun/controls');
    } else {
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
