import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
  vec,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { useSkShader } from '@hooks/useSkShader';

import type { ShaderModule } from '../../shaders/modules';

import styles from './Torus.styles';

const torusSkShader: ShaderModule = {
  module: require('./Torus.sksl'),
};

export function TorusView() {
  const { rt } = useUnistyles();
  const clock = useClock();

  const { shader } = useSkShader(torusSkShader);

  const uRotation = useSharedValue(0.0);

  const uniforms = useDerivedValue(() => ({
    uPaletteShift: 0.0,
    uColorTint: Skia.Color([6.0, 6.0, 6.0]),
    uDirection: -1.0,
    uSphereSize: 1.2,
    uPositionOffset: [0.0, 0.0, 0.0],
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

  if (!shader) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={styles.canvas}>
        <Fill>
          <Shader source={shader} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </GestureDetector>
  );
}
