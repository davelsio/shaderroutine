import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
  vec,
} from '@shopify/react-native-skia';
import { useUnistyles } from 'react-native-unistyles';
import { useMemo } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useShader } from '@hooks/useShader';
import type { ShaderModule } from '@shaders/modules';
import { vec3 } from '@helpers/skia';

import styles from './Torus.styles';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

const torusSkShader: ShaderModule = {
  module: require('./Torus.sksl'),
};

export function TorusView() {
  const { rt } = useUnistyles();
  const clock = useClock();

  const { shader } = useShader(torusSkShader);
  const skShader = useMemo(
    () => (shader ? Skia.RuntimeEffect.Make(shader) : null),
    [shader]
  );

  const uRotation = useSharedValue(0.0);

  const uniforms = useDerivedValue(() => ({
    uPaletteShift: 0.0,
    uColorTint: vec3(6.0, 6.0, 6.0),
    uDirection: -1.0,
    uSphereSize: 1.2,
    uPositionOffset: vec3(0.0, 0.0, 0.0),
    uResolution: vec(rt.screen.width, rt.screen.height),
    uRotation: uRotation.value,
    uSpeed: 0.5,
    uTime: clock.value / 1000, // convert to seconds
  }));

  const gestureContext = useSharedValue(0.0);
  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      gestureContext.value = uRotation.value;
    })
    .onUpdate(({ translationX }) => {
      'worklet';
      let t = translationX / rt.screen.width;
      uRotation.value = gestureContext.value + t * Math.PI;
    });

  if (!skShader) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={styles.canvas}>
        <Fill>
          <Shader source={skShader} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </GestureDetector>
  );
}
