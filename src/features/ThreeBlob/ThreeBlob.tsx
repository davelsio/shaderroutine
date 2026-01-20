import { Canvas } from 'react-native-wgpu';

import styles from './ThreeBlob.styles';
import { initExperience } from './ThreeExperience';

export function ThreeBlob() {
  return <Canvas ref={initExperience} style={styles.canvas} />;
}
