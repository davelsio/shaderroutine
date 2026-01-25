import { FiberCanvas } from '@components/FiberCanvas';

import { ThreeFiberScene } from './ThreeFiber.scene';

import styles from './ThreeFiber.styles';

export function ThreeFiber() {
  return (
    <FiberCanvas style={styles.canvas}>
      <ThreeFiberScene />
    </FiberCanvas>
  );
}
