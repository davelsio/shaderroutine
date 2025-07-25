import type { WithSpringConfig } from 'react-native-reanimated';

const easeOut: WithSpringConfig = {
  mass: 1,
  damping: 26, // friction
  stiffness: 170, // tension
  velocity: 0,
};

export default {
  easeOut,
};
