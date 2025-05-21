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
import { useUnistyles } from 'react-native-unistyles';
import { useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';

import { useShader } from '@hooks/useShader';
import { remap } from '@shaders/remap';
import type { ShaderModule } from '@shaders/modules';

import styles from './Cathode.styles';

const cathodeSkShader: ShaderModule = {
  module: require('./Cathode.glsl'),
  dependencies: [remap],
};

const imageURI =
  'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=800x800';

export function Cathode() {
  const { rt } = useUnistyles();
  const clock = useClock();
  const image = useImage(imageURI);

  const { shader } = useShader(cathodeSkShader);
  const skShader = useMemo(
    () => (shader ? Skia.RuntimeEffect.Make(shader) : null),
    [shader]
  );

  const uniforms = useDerivedValue(() => ({
    uResolution: vec(rt.screen.width, rt.screen.height),
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
            image={image}
            fit="cover"
            width={rt.screen.width}
            height={rt.screen.height}
          />
        </Shader>
      </Fill>
    </Canvas>
  );
}
