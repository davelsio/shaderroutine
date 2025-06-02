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
import { useDerivedValue } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { useShader } from '@hooks/useShader';
import { remap } from '@shaders/remap';
import type { ShaderModule } from '@shaders/modules';

import styles from './Sun.styles';

const sunSkShader: ShaderModule = {
  module: require('./Sun.sksl'),
  dependencies: [remap],
};

export function SunView() {
  const clock = useClock();
  const surface = useImage(require('@assets/textures/sun.png'));
  const { rt } = useUnistyles();
  const width = rt.screen.width;
  const height = rt.screen.height;

  const { shader } = useShader(sunSkShader);
  const skShader = useMemo(
    () => (shader ? Skia.RuntimeEffect.Make(shader) : null),
    [shader]
  );

  const uniforms = useDerivedValue(() => ({
    uResolution: vec(width, height),
    uTime: clock.value / 1000, // convert to seconds
  }));

  if (!skShader) {
    return null;
  }

  return (
    <Canvas style={styles.canvas}>
      <Fill>
        <Shader source={skShader} uniforms={uniforms}>
          <ImageShader
            image={surface}
            fit="fill"
            width={width}
            height={height}
            tx="repeat"
            ty="repeat"
          />
        </Shader>
      </Fill>
    </Canvas>
  );
}
