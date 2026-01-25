/**
 * Blob example scene
 * Adapted from https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
 */

import * as tsl from 'three/tsl';
import * as THREE from 'three/webgpu';

import { noise3d } from '@shaders/noise3d/noise3d.tsl';

// Helpers -------------------------------------------------------------

export const updatePosition = tsl.Fn(
  ([pos, time]: [THREE.ConstNode<THREE.Vector3>, THREE.ConstNode<number>]) => {
    const noise = noise3d(tsl.vec3(pos).add(tsl.vec3(time))).mul(0.2);
    return tsl.add(pos, noise);
  }
);

// Nodes ----------------------------------------------------------------

export const colorNode = tsl.Fn(() => {
  const color1 = tsl.vec3(0.01, 0.22, 0.98);
  const color2 = tsl.vec3(0.36, 0.68, 1.0);
  const t = tsl.clamp(tsl.length(tsl.abs(tsl.uv().sub(0.5))), 0.0, 0.8);
  return tsl.mix(color1, color2, t);
});

export function initWobble(ref: THREE.MeshPhongNodeMaterial | null) {
  if (!ref) {
    return;
  }

  // Variables -----------------------------------------------------------------

  const vNormal = tsl.varying(tsl.vec3(), 'vNormal');

  // Nodes ---------------------------------------------------------------------

  const normalNode = tsl.Fn(() => {
    const normal = vNormal;
    return tsl.transformNormalToView(normal);
  });

  const positionNode = tsl.Fn(() => {
    const pos = tsl.positionLocal;

    const updatedPos = updatePosition(pos, tsl.time);
    const theta = tsl.float(0.001);

    const vecTangent = tsl.tangentLocal;
    const vecBiTangent = tsl.normalize(tsl.cross(tsl.normalLocal, vecTangent));

    const neighbour1 = pos.add(vecTangent.mul(theta));
    const neighbour2 = pos.add(vecBiTangent.mul(theta));

    const displacedNeighbour1 = updatePosition(neighbour1, tsl.time);
    const displacedNeighbour2 = updatePosition(neighbour2, tsl.time);

    const displacedTangent = displacedNeighbour1.sub(updatedPos);
    const displacedBitangent = displacedNeighbour2.sub(updatedPos);

    const normal = tsl.normalize(
      tsl.cross(displacedTangent, displacedBitangent)
    );

    const displacedNormal = normal
      .dot(tsl.normalLocal)
      .lessThan(0.0)
      .select(normal.negate(), normal);
    vNormal.assign(displacedNormal);

    return updatedPos;
  });

  // Material ------------------------------------------------------------------

  ref.normalNode = normalNode();
  ref.positionNode = positionNode();

  return () => {
    vNormal.dispose();
  };
}
