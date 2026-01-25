// import { ThreeFiber } from '@features/ThreeFiber';

import { lazy, Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

const ThreeFiber = lazy(() =>
  import('@features/ThreeFiber').then((module) => ({
    default: module.ThreeFiber,
  }))
);

export default function ThreeFiberScreen() {
  return (
    <Suspense fallback={<ActivityIndicator animating />}>
      <ThreeFiber />
    </Suspense>
  );
}
