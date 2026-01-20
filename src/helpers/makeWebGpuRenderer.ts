/**
 * Wrapper around the Three.js WebGPURenderer.
 *
 * The Three.js WebGPURenderer class expects a JS-based, web Canvas API.
 * However, the `react-native-webgpu` Canvas is a host object (native view)
 * exposing a non-compliant API.
 *
 * This helper initializes a new renderer using a thin wrapper that emulates
 * the web Canvas API surface.
 *
 * @see https://github.com/wcandillon/react-native-webgpu/blob/578ad989b4326724702b14245d5c82622849ee23/apps/example/src/ThreeJS/components/makeWebGPURenderer.ts#L1
 */
import type { NativeCanvas } from 'react-native-wgpu';
import * as THREE from 'three/webgpu';

export class ReactNativeCanvas {
  private canvas: NativeCanvas;

  constructor(canvas: NativeCanvas) {
    this.canvas = canvas;
  }

  get width() {
    return this.canvas.width;
  }
  set width(width: number) {
    this.canvas.width = width;
  }

  get height() {
    return this.canvas.height;
  }
  set height(height: number) {
    this.canvas.height = height;
  }

  get clientWidth() {
    return this.canvas.width;
  }
  set clientWidth(width: number) {
    this.canvas.width = width;
  }

  get clientHeight() {
    return this.canvas.height;
  }
  set clientHeight(height: number) {
    this.canvas.height = height;
  }

  addEventListener(_type: string, _listener: EventListener) {
    // TODO
  }

  removeEventListener(_type: string, _listener: EventListener) {
    // TODO
  }

  dispatchEvent(_event: Event) {
    // TODO
  }

  setPointerCapture() {
    // TODO
  }

  releasePointerCapture() {
    // TODO
  }
}

type WebGPURendererParameters = NonNullable<
  ConstructorParameters<typeof THREE.WebGPURenderer>[0]
>;

export function makeWebGPURenderer(
  context: GPUCanvasContext,
  params: Omit<WebGPURendererParameters, 'canvas' | 'context'> = {}
) {
  return new THREE.WebGPURenderer({
    ...params,
    // @ts-expect-error
    canvas: new ReactNativeCanvas(context.canvas),
    context,
  });
}
