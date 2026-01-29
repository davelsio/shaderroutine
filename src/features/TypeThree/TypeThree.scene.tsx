import * as t3 from '@typegpu/three';
import * as TSL from 'three/tsl';
import * as THREE from 'three/webgpu';

import {
  backgroundColorNode,
  blob,
  blobColorNode,
  blobNormalNode,
  POSITION_STORAGE,
} from './TypeThree.tsl';

export function TypeThreeScene() {
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
              colorNode: t3.toTSL(backgroundColorNode),
              side: THREE.BackSide,
            },
          ]}
        />
      </mesh>

      {/* SPHERE */}
      <mesh scale={0.5}>
        <icosahedronGeometry args={[2.5, 64]} />
        <meshPhongNodeMaterial
          args={[
            {
              colorNode: blobColorNode(),
              geometryNode: blob() as unknown as () => THREE.Node,
              positionNode: TSL.attribute(POSITION_STORAGE),
              normalNode: blobNormalNode(),
            },
          ]}
        />
      </mesh>
    </>
  );
}
