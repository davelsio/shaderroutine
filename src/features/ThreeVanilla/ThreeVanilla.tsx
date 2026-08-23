import { Canvas } from 'react-native-webgpu';

import { initExperience } from './ThreeVanilla.tsl';

import styles from './ThreeVanilla.styles';

export function ThreeVanilla() {
  return <Canvas ref={initExperience} style={styles.canvas} />;
}
