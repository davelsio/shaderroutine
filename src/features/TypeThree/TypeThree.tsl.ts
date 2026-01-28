/**
 * Blob example scene. Adapted from:
 * - https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
 * - https://threejs-journey.com/lessons/wobbly-sphere-shader
 */
import * as t3 from '@typegpu/three';
import * as TSL from 'three/tsl';
import * as THREE from 'three/webgpu';
import * as d from 'typegpu/data';
import * as std from 'typegpu/std';

import { simplexNoise4d } from '@shaders/noise/simplex4d.tgpu';

// import { simplexNoise4d } from './Simplex4d.tgpu';

// Constants -------------------------------------------------------------------

export const NORMAL_STORAGE = 'storageNormal';
export const POSITION_STORAGE = 'storagePosition';

// Uniforms --------------------------------------------------------------------

const uPositionFrequency = t3.uniform(0.5, d.f32);
const uTimeFrequency = t3.uniform(0.4, d.f32);
const uStrength = t3.uniform(0.3, d.f32);

// Helpers ---------------------------------------------------------------------

function getDisplacement(pos: d.v3f) {
  'use gpu';
  return (
    simplexNoise4d(
      d.vec4f(pos.mul(uPositionFrequency.$), t3.time.$ * uTimeFrequency.$)
    ) * uStrength.$
  );
}

// Nodes -----------------------------------------------------------------------

export function colorNode() {
  'use gpu';
  const color1 = d.vec3f(0.01, 0.22, 0.98);
  const color2 = d.vec3f(0.36, 0.68, 1.0);
  const t = std.clamp(std.length(std.abs(t3.uv().$.sub(0.5))), 0.0, 0.8);
  return d.vec4f(std.mix(color1, color2, t), 1.0);
}

export const normalNode = TSL.Fn(() => {
  const normal = TSL.attribute(NORMAL_STORAGE, 'vec3');
  return TSL.transformNormalToView(normal);
});

export const blob = TSL.Fn(({ renderer, geometry }) => {
  const _geometry = geometry as THREE.BufferGeometry<
    // Infer the correct attributes type when calling TSL.storage
    Record<string, THREE.BufferAttribute>
  >;
  const positionAttr = _geometry.attributes.position;
  const normalAttr = _geometry.attributes.normal;
  const count = positionAttr.count;

  // Tangent -------------------------------------------------------------------

  // const tangentAccessor = t3.fromTSL(
  //   TSL.storage(
  //     geometry.attributes.tangent as THREE.BufferAttribute,
  //     'vec4',
  //     count
  //   ),
  //   d.arrayOf(d.vec4f)
  // );

  // Normal --------------------------------------------------------------------

  const normalStorage = new THREE.StorageBufferAttribute(count, 3);
  _geometry.setAttribute(NORMAL_STORAGE, normalStorage);

  const normalAccessor = t3.fromTSL(
    TSL.storage(normalAttr, 'vec3', count),
    d.arrayOf(d.vec3f)
  );

  const updatedNormalAccessor = t3.fromTSL(
    TSL.storage(normalStorage, 'vec3', count),
    d.arrayOf(d.vec3f)
  );

  // Position ------------------------------------------------------------------

  const positionStorage = new THREE.StorageBufferAttribute(count, 3);
  _geometry.setAttribute(POSITION_STORAGE, positionStorage);

  const positionAccesor = t3.fromTSL(
    TSL.storage(positionAttr, 'vec3', count),
    d.arrayOf(d.vec3f)
  );

  const updatedPositionAccessor = t3.fromTSL(
    TSL.storage(positionStorage, 'vec3', count),
    d.arrayOf(d.vec3f)
  );

  // Compute -------------------------------------------------------------------

  const computeInit = t3
    .toTSL(() => {
      'use gpu';
      const idx = t3.instanceIndex.$;
      updatedNormalAccessor.$[idx] = normalAccessor.$[idx];
      updatedPositionAccessor.$[idx] = positionAccesor.$[idx];
    })
    .compute(count)
    .setName('Init Blob');

  const computeUpdate = t3
    .toTSL(() => {
      'use gpu';
      const idx = t3.instanceIndex.$;
      const position = positionAccesor.$[idx];
      const normal = normalAccessor.$[idx];
      // const tangent = tangentAccessor.$[idx].xyz;
      const tangent = std.select(
        std.normalize(d.vec3f(0.0, -normal.z, normal.y)),
        std.normalize(d.vec3f(-normal.y, normal.x, 0.0)),
        std.abs(normal.x) > std.abs(normal.z)
      );
      const biTangent = std.normalize(std.cross(normal, tangent));
      const theta = 0.001;

      // Position
      const noise = normal.mul(getDisplacement(position));
      const updatedPos = position.add(noise);
      updatedPositionAccessor.$[idx] = d.vec3f(updatedPos);

      // Normal (neighbors technique)
      const n1Pos = position.add(tangent.mul(theta));
      const n1Noise = normal.mul(getDisplacement(n1Pos));
      const n1UpdatedPos = n1Pos.add(n1Noise);

      const n2Pos = position.add(biTangent.mul(theta));
      const n2Noise = normal.mul(getDisplacement(n2Pos));
      const n2UpdatedPos = n2Pos.add(n2Noise);

      const updatedTangent = std.normalize(n1UpdatedPos.sub(updatedPos));
      const updatedBitangent = std.normalize(n2UpdatedPos.sub(updatedPos));

      let updatedNormal = std.cross(updatedTangent, updatedBitangent);

      updatedNormal = std.select(
        updatedNormal,
        std.neg(updatedNormal),
        std.dot(updatedNormal, normal) < 0.0
      );

      updatedNormalAccessor.$[idx] = d.vec3f(updatedNormal);
    })
    .compute(count)
    .setName('Update Blob');

  computeUpdate.onInit(() => renderer.compute(computeInit));

  return computeUpdate;
});
