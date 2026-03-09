/**
 * Blob example scene. Adapted from:
 * - https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
 * - https://threejs-journey.com/lessons/wobbly-sphere-shader
 */
import * as t3 from '@typegpu/three';
import * as tsl from 'three/tsl';
import * as THREE from 'three/webgpu';
import * as d from 'typegpu/data';
import * as std from 'typegpu/std';

import { simplexNoise4d } from '@shaders/noise/simplex4d.tgpu';
import { remap } from '@shaders/remap/remap.gpu';

// Constants -------------------------------------------------------------------

export const NOISE_STORAGE = 'storageNoise';
export const NORMAL_STORAGE = 'storageNormal';
export const POSITION_STORAGE = 'storagePosition';

// Uniforms --------------------------------------------------------------------

const uPositionFrequency = t3.uniform(0.5, d.f32);
const uTimeFrequency = t3.uniform(0.4, d.f32);
const uStrength = t3.uniform(0.3, d.f32);

const uWarpedPositionFrequency = t3.uniform(0.38, d.f32);
const uWarpedTimeFrequency = t3.uniform(0.12, d.f32);
const uWarpedStrength = t3.uniform(1.7, d.f32);

// Helpers ---------------------------------------------------------------------

function getWarp(pos: d.v3f) {
  'use gpu';
  const time = t3.time.$;

  const warpedPosition = pos.add(
    simplexNoise4d(
      d.vec4f(
        pos.mul(uWarpedPositionFrequency.$),
        time * uWarpedTimeFrequency.$
      )
    ) * uWarpedStrength.$
  );

  return (
    simplexNoise4d(
      d.vec4f(warpedPosition.mul(uPositionFrequency.$), time * uTimeFrequency.$)
    ) * uStrength.$
  );
}

// Background ------------------------------------------------------------------

export function backgroundMaterial(ref: THREE.MeshBasicNodeMaterial | null) {
  if (!ref) {
    return;
  }

  const backgroundColorNode = t3.toTSL(() => {
    'use gpu';
    const color1 = d.vec3f(0.01, 0.22, 0.98);
    const color2 = d.vec3f(0.36, 0.68, 1.0);
    const t = std.clamp(std.length(std.abs(t3.uv().$.sub(0.5))), 0.0, 0.8);
    return d.vec4f(std.mix(color1, color2, t), 1.0);
  });

  ref.colorNode = backgroundColorNode as THREE.Node<'vec4'>;
  ref.side = THREE.BackSide;
}

// Sphere ----------------------------------------------------------------------

export function blobMaterial(ref: THREE.MeshPhongNodeMaterial | null) {
  if (!ref) {
    return;
  }

  // Constants ----------------------------------------------------------------

  const BLUE = tsl.color('#0000ff');
  const RED = tsl.color('#ff0000');

  // Nodes ---------------------------------------------------------------------

  const blobColorNode = tsl.Fn(() => {
    const noise = tsl.attribute<'float'>(NOISE_STORAGE, 'float');
    const t = tsl.smoothstep(0.25, 1.0, noise);
    // return TSL.vec4(TSL.vec3(t), 1.0);
    return tsl.vec4(tsl.mix(BLUE, RED, t), 1.0);
  });

  const blobNormalNode = tsl.Fn(() => {
    const normal = tsl.attribute(NORMAL_STORAGE, 'vec3');
    return tsl.transformNormalToView(normal);
  });

  const blobGeometryNode = tsl.Fn(({ renderer, geometry }) => {
    const _geometry = geometry as THREE.BufferGeometry<
      // Infer the correct attributes type when calling TSL.storage
      Record<string, THREE.BufferAttribute>
    >;
    const positionAttr = _geometry.attributes.position;
    const normalAttr = _geometry.attributes.normal;
    const count = positionAttr.count;

    // Noise ---------------------------------------------------------------------

    const noiseStorage = new THREE.StorageBufferAttribute(count, 1);
    _geometry.setAttribute(NOISE_STORAGE, noiseStorage);

    const noiseAccessor = t3.fromTSL(
      tsl.storage(noiseStorage, 'float', count),
      d.arrayOf(d.f32)
    );

    // Normal --------------------------------------------------------------------

    const normalStorage = new THREE.StorageBufferAttribute(count, 3);
    _geometry.setAttribute(NORMAL_STORAGE, normalStorage);

    const normalAccessor = t3.fromTSL(
      tsl.storage(normalAttr, 'vec3', count),
      d.arrayOf(d.vec3f)
    );

    const updatedNormalAccessor = t3.fromTSL(
      tsl.storage(normalStorage, 'vec3', count),
      d.arrayOf(d.vec3f)
    );

    // Position ------------------------------------------------------------------

    const positionStorage = new THREE.StorageBufferAttribute(count, 3);
    _geometry.setAttribute(POSITION_STORAGE, positionStorage);

    const positionAccesor = t3.fromTSL(
      tsl.storage(positionAttr, 'vec3', count),
      d.arrayOf(d.vec3f)
    );

    const updatedPositionAccessor = t3.fromTSL(
      tsl.storage(positionStorage, 'vec3', count),
      d.arrayOf(d.vec3f)
    );

    // Tangent -------------------------------------------------------------------

    // const tangentAccessor = t3.fromTSL(
    //   TSL.storage(
    //     geometry.attributes.tangent as THREE.BufferAttribute,
    //     'vec4',
    //     count
    //   ),
    //   d.arrayOf(d.vec4f)
    // );

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

        // Noise
        const noise = getWarp(position);
        // noiseAccessor.$[idx] = noise / uStrength.$;
        // noiseAccessor.$[idx] = noise * 20.0;
        // noiseAccessor.$[idx] = noise;
        noiseAccessor.$[idx] = remap(noise / uStrength.$, -1.0, 1.0, 0.0, 1.0);

        // Position
        const displacement = normal.mul(noise);
        const updatedPos = position.add(displacement);
        updatedPositionAccessor.$[idx] = d.vec3f(updatedPos);

        // Normal (neighbors technique)
        const n1Pos = position.add(tangent.mul(theta));
        const n1Displacement = normal.mul(getWarp(n1Pos));
        const n1UpdatedPos = n1Pos.add(n1Displacement);

        const n2Pos = position.add(biTangent.mul(theta));
        const n2Displacement = normal.mul(getWarp(n2Pos));
        const n2UpdatedPos = n2Pos.add(n2Displacement);

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

  ref.colorNode = blobColorNode();
  ref.geometryNode = blobGeometryNode();
  ref.positionNode = tsl.attribute(POSITION_STORAGE);
  ref.normalNode = blobNormalNode();

  // Cleanup -------------------------------------------------------------------

  return () => {
    BLUE.dispose();
    RED.dispose();
  };
}
