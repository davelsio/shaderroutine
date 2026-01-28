import { View } from 'react-native';

import { FiberCanvas } from '@components/FiberCanvas';
import { useControls } from '@components/OrbitControls';

import { TypeThreeScene } from './TypeThree.scene';

import styles from './TypeThree.styles';

export function TypeThree() {
  const [OrbitControls, events] = useControls();

  return (
    <View style={styles.view} {...events}>
      <FiberCanvas style={styles.canvas}>
        <OrbitControls />
        <TypeThreeScene />
      </FiberCanvas>
    </View>
  );
}
