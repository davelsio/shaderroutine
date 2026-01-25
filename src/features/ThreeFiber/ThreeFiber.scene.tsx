import * as THREE from 'three/webgpu';

import { colorNode, initWobble } from './ThreeFiber.tsl';

export function ThreeFiberScene() {
  const sphereRef = (ref: THREE.SphereGeometry | null) => {
    if (!ref) return;
    ref.computeTangents();
  };

  return (
    <>
      {/* ENVIRONMENT */}
      <directionalLight args={[0xffffff, 4.0]} position={[10, 10, 10]} />
      <ambientLight args={[0xffffff, 0.5]} />

      {/* BACKGROUND */}
      <mesh>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicNodeMaterial
          args={[
            {
              colorNode: colorNode(),
              side: THREE.BackSide,
            },
          ]}
        />
      </mesh>

      {/* SPHERE */}
      <mesh>
        <sphereGeometry ref={sphereRef} args={[1, 32, 32]} />
        <meshPhongNodeMaterial
          ref={initWobble}
          args={[
            {
              color: '#ffffff',
              emissive: new THREE.Color(0xffffff).multiplyScalar(0.25),
              shininess: 400,
            },
          ]}
        />
      </mesh>
    </>
  );
}
