import { Canvas } from 'react-native-wgpu';

import { initExperience } from './ThreeExperience';

import styles from './ThreeBlob.styles';

export function ThreeBlob() {
  return <Canvas ref={initExperience} style={styles.canvas} />;
}
