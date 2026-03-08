/**
 * Blob example scene. Adapted from:
 * - https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
 */

import type { CanvasRef } from 'react-native-wgpu';
import * as tsl from 'three/tsl';
import * as THREE from 'three/webgpu';

import { makeWebGPURenderer } from '@helpers/makeWebGpuRenderer';
import { simplexNoise4d } from '@shaders/noise/simplex4d.tsl';

// Variables --------------------------------------------------------------------

let vNormal: THREE.VaryingNode;

// Helpers -------------------------------------------------------------

const orthogonal = tsl.Fn(([normal]: [THREE.ConstNode<THREE.Vector3>]) => {
  return tsl.select(
    tsl.abs(normal.x).greaterThan(tsl.abs(normal.z)),
    tsl.vec3(tsl.normalize(tsl.vec3(tsl.negate(normal.y), normal.x, 0.0))),
    tsl.vec3(tsl.normalize(tsl.vec3(0.0, tsl.negate(normal.z), normal.y)))
  );
});

const getDisplacement = tsl.Fn(([pos]: [THREE.ConstNode<THREE.Vector3>]) => {
  return simplexNoise4d(tsl.vec4(pos.mul(0.5), tsl.time.mul(0.5))).mul(0.5);
});

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
  const position = tsl.positionLocal;
  const normal = tsl.normalLocal;
  const tangent = orthogonal(normal);
  const biTangent = tsl.normalize(tsl.cross(normal, tangent));
  const theta = tsl.float(0.01);

  const noise = getDisplacement(position).mul(normal);
  const updatedPosition = position.add(noise);

  const n1Pos = position.add(tangent.mul(theta));
  const n1Noise = getDisplacement(n1Pos).mul(normal);
  const n1UpdatedPos = n1Pos.add(n1Noise);

  const n2Pos = position.add(biTangent.mul(theta));
  const n2Noise = getDisplacement(n2Pos).mul(normal);
  const n2UpdatedPos = n2Pos.add(n2Noise);

  const updatedTangent = tsl.normalize(n1UpdatedPos.sub(updatedPosition));
  const updatedBitangent = tsl.normalize(n2UpdatedPos.sub(updatedPosition));

  let updatedNormal = tsl.cross(updatedTangent, updatedBitangent);

  updatedNormal = tsl.select(
    updatedNormal.dot(normal).lessThan(0.0),
    updatedNormal.negate(),
    updatedNormal
  ) as typeof updatedNormal;

  vNormal.assign(updatedNormal);

  return updatedPosition;
});

// Experience ------------------------------------------------------------------

export const initExperience = (ref: CanvasRef | null) => {
  const context = ref?.getContext('webgpu');

  if (!ref || !context) {
    return;
  }

  // Variables ------------------------------------------------------------------

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
  });
  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  scene.add(background);

  // Sphere --------------------------------------------------------------------

  const sphereGeometry = new THREE.IcosahedronGeometry(2.5, 64);
  const sphereMaterial = new THREE.MeshPhongNodeMaterial({
    color: 'white',
    normalNode: normalNode(),
    positionNode: positionNode(),
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.scale.set(0.5, 0.5, 0.5);
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
