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
import { Canvas, NativeCanvas, type CanvasRef } from 'react-native-wgpu';
import * as THREE from 'three/webgpu';

import {
  makeWebGPURenderer,
  ReactNativeCanvas,
} from '@helpers/makeWebGpuRenderer';

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

    const canvas = new ReactNativeCanvas(
      context.canvas as unknown as NativeCanvas
    );
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
    const size = {
      top: 0,
      left: 0,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    };

    const root = createRoot(canvas as unknown as HTMLCanvasElement);
    const renderer = makeWebGPURenderer(context);

    root.configure({
      dpr: pxRatio,
      events,
      camera,
      frameloop: 'always',
      gl: renderer,
      scene,
      size,
      onCreated: async (state) => {
        await (state.gl as unknown as THREE.WebGPURenderer).init();
        const renderFrame = state.gl.render.bind(state.gl);
        state.gl.render = (scene: THREE.Scene, camera: THREE.Camera) => {
          renderFrame(scene, camera);
          context.present();
        };
      },
    });

    root.render(children);

    return () => {
      unmountComponentAtNode(canvas as unknown as HTMLCanvasElement);
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
