import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  useClock,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { useSkShader } from '@hooks/useShader';
import type { ShaderModule } from '@shaders/modules';
import { remap } from '@shaders/remap';

import styles from './Cathode.styles';

const cathodeSkShader: ShaderModule = {
  module: require('./Cathode.sksl'),
  dependencies: [remap],
};

const imageURI =
  'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=800x800';

export function CathodeView() {
  const { rt } = useUnistyles();
  const clock = useClock();
  const image = useImage(imageURI);

  const { shader } = useSkShader(cathodeSkShader);

  const uniforms = useDerivedValue(() => ({
    uResolution: vec(rt.screen.width, rt.screen.height),
    uTime: clock.value / 1000, // convert to seconds
  }));

  if (!shader) {
    return null;
  }

  return (
    <Canvas style={styles.canvas}>
      <Fill>
        <Shader source={shader} uniforms={uniforms}>
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
