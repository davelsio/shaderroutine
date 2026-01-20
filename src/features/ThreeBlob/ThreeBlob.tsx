import { Canvas } from 'react-native-wgpu';

import { initExperience } from './ThreeExperience';

export function ThreeBlob() {
  return <Canvas ref={initExperience} style={{ flex: 1 }} />;
}
