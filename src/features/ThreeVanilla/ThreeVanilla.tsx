import { Canvas } from 'react-native-wgpu';

import { initExperience } from './ThreeVanilla.tsl';

import styles from './ThreeVanilla.styles';

export function ThreeVanilla() {
  return <Canvas ref={initExperience} style={styles.canvas} />;
}
