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

// Uniforms --------------------------------------------------------------------

const uPositionFrequency = t3.uniform(0.5, d.f32);
const uTimeFrequency = t3.uniform(0.4, d.f32);
const uStrength = t3.uniform(0.3, d.f32);

const uWarpedPositionFrequency = t3.uniform(0.38, d.f32);
const uWarpedTimeFrequency = t3.uniform(0.12, d.f32);
const uWarpedStrength = t3.uniform(1.7, d.f32);

// Constants

const BLUE = t3.fromTSL(tsl.color('#0000ff'), d.vec3f);
const RED = t3.fromTSL(tsl.color('#ff0000'), d.vec3f);

// Variables & Accesors --------------------------------------------------------

const vNormal = tsl.varying(tsl.vec3(), 'vNormal');
const vNormalAcc = t3.fromTSL(vNormal, d.vec3f);

const vNoise = tsl.varying(tsl.vec2(), 'vNoise'); // workaround read-only tgpu accesors
const vNoiseAcc = t3.fromTSL(vNoise, d.vec2f);

const normalLocal = t3.fromTSL(tsl.normalLocal, d.vec3f);
const positionLocal = t3.fromTSL(tsl.positionLocal, d.vec3f);

const transformedNormal = t3.fromTSL(
  tsl.transformNormalToView(vNormal),
  d.vec3f
);

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

  // Nodes ---------------------------------------------------------------------

  const colorNode = tsl.Fn(() => {
    const t = tsl.smoothstep(0.25, 1.0, vNoise.x);
    const mix = tsl.mix(BLUE.node, RED.node, t);
    return tsl.vec4(mix, 1.0);
  });

  const normalNode = t3.toTSL(() => {
    'use gpu';
    return std.normalize(transformedNormal.$);
  });

  const positionNode = t3.toTSL(() => {
    'use gpu';
    const position = positionLocal.$;
    const normal = normalLocal.$;
    const tangent = std.select(
      std.normalize(d.vec3f(0.0, -normal.z, normal.y)),
      std.normalize(d.vec3f(-normal.y, normal.x, 0.0)),
      std.abs(normal.x) > std.abs(normal.z)
    );
    const biTangent = std.normalize(std.cross(normal, tangent));
    const theta = 0.001;

    // Noise
    const noise = getWarp(position);
    vNoiseAcc.$.x = remap(noise / uStrength.$, -1.0, 1.0, 0.0, 1.0);

    // Position
    const displacement = normal.mul(noise);
    const updatedPos = position.add(displacement);

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

    vNormalAcc.$.x = updatedNormal.x;
    vNormalAcc.$.y = updatedNormal.y;
    vNormalAcc.$.z = updatedNormal.z;

    return updatedPos;
  });

  ref.colorNode = colorNode();
  ref.positionNode = positionNode;
  ref.normalNode = normalNode;

  // Cleanup -------------------------------------------------------------------

  return () => {
    BLUE.node.dispose();
    RED.node.dispose();
  };
}
