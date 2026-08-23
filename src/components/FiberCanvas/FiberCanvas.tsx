/**
 * Adapted from https://github.com/wcandillon/react-native-webgpu/blob/578ad989b4326724702b14245d5c82622849ee23/apps/example/src/ThreeJS/components/FiberCanvas.tsx#L1
 */
import {
  createRoot,
  events,
  extend,
  ThreeElement,
  unmountComponentAtNode,
} from '@react-three/fiber';
import { useState } from 'react';
import { PixelRatio, type StyleProp, type ViewStyle } from 'react-native';
import { Canvas, type CanvasRef, type NativeCanvas } from 'react-native-webgpu';
import * as THREE from 'three/webgpu';

interface FiberCanvasProps {
  children: React.ReactNode;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  style?: StyleProp<ViewStyle>;
}

export function FiberCanvas({
  camera,
  children,
  scene,
  style,
}: FiberCanvasProps) {
  // @ts-expect-error
  // https://tkdodo.eu/blog/use-state-for-one-time-initializations
  useState(() => extend(THREE));

  const init = (canvasRef: CanvasRef | null) => {
    const context = canvasRef?.getContext('webgpu')!;

    if (!context) {
      return;
    }

    const pxRatio = Math.min(PixelRatio.get(), 2);

    const canvas = context.canvas as GPUCanvasContext['canvas'] & NativeCanvas;
    const root = createRoot(canvas);
    const renderer = new THREE.WebGPURenderer({
      canvas: canvas,
      context: context,
    });

    root.configure({
      dpr: pxRatio,
      events,
      camera,
      frameloop: 'always',
      gl: async () => renderer.init(),
      scene,
      size: {
        top: 0,
        left: 0,
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      },
      onCreated: (state) => {
        const renderFrame = state.gl.render.bind(state.gl);
        state.gl.render = (scene: THREE.Scene, camera: THREE.Camera) => {
          renderFrame(scene, camera);
          context.present();
        };
      },
    });

    root.render(children);

    return () => {
      unmountComponentAtNode(canvas);
    };
  };

  return <Canvas ref={init} style={style} />;
}

// Add NodeMaterial types to ThreeElements so primitives pick up on it
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshBasicNodeMaterial: ThreeElement<typeof THREE.MeshBasicNodeMaterial>;
    meshPhongNodeMaterial: ThreeElement<typeof THREE.MeshPhongNodeMaterial>;
  }
}
