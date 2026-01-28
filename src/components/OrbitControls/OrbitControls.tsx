import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

import { createControls } from './createControls';
import { isValidCamera } from './isValidCamera';

export type OrbitControlsProps = Partial<
  Omit<ReturnType<typeof createControls>['scope'], 'camera'>
>;

export type OrbitControlsChangeEvent = Parameters<
  ReturnType<typeof createControls>['scope']['onChange']
>[0];

type OrbitControlsInternalProps = OrbitControlsProps & {
  controls: ReturnType<typeof createControls>;
};

function OrbitControls({ controls, ...props }: OrbitControlsInternalProps) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    if (!isValidCamera(camera)) {
      throw new Error(
        'OrbitControls camera must be an instance of PerspectiveCamera or OrthographicCamera'
      );
    }
    Object.assign(controls.scope, props, { camera });
  }, [camera, controls, props]);

  /**
   * Execute first on every frame
   * https://r3f.docs.pmnd.rs/api/hooks#negative-indices
   */
  useFrame(controls.functions.update, -1);

  return null;
}

export function useControls() {
  const [controls] = useState(() => createControls());
  const OrbitControlsComponent = (props: OrbitControlsProps) => (
    <OrbitControls controls={controls} {...props} />
  );

  return [OrbitControlsComponent, controls.events] as const;
}
