/**
 * Blob example scene
 * Adapted from https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
 */

import type { CanvasRef } from 'react-native-wgpu';
import * as tsl from 'three/tsl';
import * as THREE from 'three/webgpu';

import { makeWebGPURenderer } from '@helpers/makeWebGpuRenderer';
import { noise3d } from '@shaders/noise3d/noise3d.tsl';

// Uniforms --------------------------------------------------------------------

let vNormal: THREE.VaryingNode;

// Helpers -------------------------------------------------------------

const orthogonal = tsl.Fn(([normal]: [THREE.ConstNode<THREE.Vector3>]) => {
  return tsl.select(
    tsl.abs(normal.x).greaterThan(tsl.abs(normal.z)),
    tsl.vec3(tsl.normalize(tsl.vec3(tsl.negate(normal.y), normal.x, 0.0))),
    tsl.vec3(tsl.normalize(tsl.vec3(0.0, tsl.negate(normal.z), normal.y)))
  );
});

const updatePosition = tsl.Fn(
  ([pos, time]: [THREE.ConstNode<THREE.Vector3>, THREE.ConstNode<number>]) => {
    const noise = noise3d(tsl.vec3(pos).add(tsl.vec3(time))).mul(0.2);
    return tsl.add(pos, noise);
  }
);

// Nodes ----------------------------------------------------------------

const colorNode = tsl.Fn(() => {
  const color1 = tsl.vec3(0.01, 0.22, 0.98);
  const color2 = tsl.vec3(0.36, 0.68, 1.0);
  const t = tsl.clamp(tsl.length(tsl.abs(tsl.uv().sub(0.5))), 0.0, 0.8);
  return tsl.mix(color1, color2, t);
});

const normalNode = tsl.Fn(() => {
  const normal = vNormal;
  return tsl.transformNormalToView(normal);
});

const positionNode = tsl.Fn(() => {
  const pos = tsl.positionLocal;
  const normalLocal = tsl.normalLocal;

  const updatedPos = updatePosition(pos, tsl.time);
  const theta = tsl.float(0.001);

  const vecTangent = orthogonal(normalLocal);
  const vecBiTangent = tsl.normalize(tsl.cross(normalLocal, vecTangent));

  const neighbour1 = pos.add(vecTangent.mul(theta));
  const neighbour2 = pos.add(vecBiTangent.mul(theta));

  const displacedNeighbour1 = updatePosition(neighbour1, tsl.time);
  const displacedNeighbour2 = updatePosition(neighbour2, tsl.time);

  const displacedTangent = displacedNeighbour1.sub(updatedPos);
  const displacedBitangent = displacedNeighbour2.sub(updatedPos);

  const normal = tsl.normalize(tsl.cross(displacedTangent, displacedBitangent));

  const displacedNormal = normal
    .dot(tsl.normalLocal)
    .lessThan(0.0)
    .select(normal.negate(), normal);
  vNormal.assign(displacedNormal);

  return updatedPos;
});

// Experience ------------------------------------------------------------------

export const initExperience = (ref: CanvasRef | null) => {
  const context = ref?.getContext('webgpu');

  if (!ref || !context) {
    return;
  }

  // Uniforms ------------------------------------------------------------------

  vNormal = tsl.varying(tsl.vec3(), 'vNormal');

  // Scene ---------------------------------------------------------------------

  const { width, height } = context.canvas;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;

  const scene = new THREE.Scene();

  // Lighting ------------------------------------------------------------------

  const dirLight = new THREE.DirectionalLight(0xffffff, 4.0);
  dirLight.position.set(10, 10, 10);
  scene.add(dirLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Background ----------------------------------------------------------------

  const backgroundGeometry = new THREE.SphereGeometry(4, 32, 32);
  const backgroundMaterial = new THREE.MeshBasicNodeMaterial({
    side: THREE.BackSide,
    colorNode: colorNode(),
    // colorNode: t3.toTSL(colorNodeTgpu),
  });
  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  scene.add(background);

  // Sphere --------------------------------------------------------------------

  const sphereGeometry = new THREE.IcosahedronGeometry(1.0, 50);
  const sphereMaterial = new THREE.MeshPhongNodeMaterial({
    color: 'white',
    emissive: new THREE.Color(0xffffff).multiplyScalar(0.25),
    shininess: 400,
    normalNode: normalNode(),
    positionNode: positionNode(),
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // Renderer ------------------------------------------------------------------

  const renderer = makeWebGPURenderer(context, {
    antialias: true,
  });
  renderer.init();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    context.present();
  });

  // Cleanup -------------------------------------------------------------------

  return () => {
    renderer.setAnimationLoop(null);

    dirLight.dispose();
    ambientLight.dispose();

    backgroundGeometry.dispose();
    backgroundMaterial.dispose();

    sphereGeometry.dispose();
    sphereMaterial.dispose();

    renderer.dispose();

    vNormal.dispose();
  };
};
