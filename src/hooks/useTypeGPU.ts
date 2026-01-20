import { CanvasRef, useDevice, type RNCanvasContext } from 'react-native-wgpu';
import { tgpu, type TgpuRoot } from 'typegpu';

interface RenderProps {
  canvas: RNCanvasContext['canvas'];
  context: RNCanvasContext;
  device: GPUDevice;
  gpu: GPU;
  presentationFormat: GPUTextureFormat;
  root: TgpuRoot;
}

type RenderArgs = {
  /**
   * Time elapsed since the last frame in seconds.
   */
  delta: number;
  /**
   * Total time elapsed in seconds.
   */
  elapsed: number;
  /**
   * Elapsed simulation time in seconds, adjusted for lag smoothing.
   */
  time: number;
};

type RenderCallback = (args: RenderArgs) => void;

type TgpuCallback = (props: RenderProps) => RenderCallback;
type TgpuOptions = {
  /**
   * Delta time threshold in milliseconds at which frame rate adjustment occurs.
   * Set this to prevent physics sim explosions due to frame drops.
   *
   * @default 0.1 // 100ms
   */
  lagThreshold?: number;
  /**
   * Maximum delta step. Delta adjusted value to use if `lagThreshold` is
   * reached.
   *
   * @default 1 / 30 // ~30fps
   */
  maxDelta?: number;
};

const defaultOptions: Required<TgpuOptions> = {
  lagThreshold: 0.1,
  maxDelta: 1 / 30,
};

export function useTypeGPU(tgpuCallback: TgpuCallback, options?: TgpuOptions) {
  const { device } = useDevice();

  const cbRef = (ref: CanvasRef | null) => {
    const context = ref?.getContext('webgpu');

    if (!device || !context) {
      return;
    }

    const root = tgpu.initFromDevice({ device });
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
      device: device,
      format: presentationFormat,
      alphaMode: 'premultiplied',
    });

    const sceneProps: RenderProps = {
      canvas: context.canvas,
      context,
      device,
      gpu: navigator.gpu,
      presentationFormat,
      root,
    };

    let renderCb = tgpuCallback(sceneProps);

    let animationId: number;
    let prev = 0;
    let simTime = 0;

    const { lagThreshold, maxDelta } = Object.assign(
      {},
      options,
      defaultOptions
    );
    const render = (t: number) => {
      const ts = t / 1000; // seconds
      let dt = ts - prev;
      prev = ts;

      if (dt > lagThreshold) {
        dt = Math.min(dt, maxDelta);
      }

      simTime += dt;

      renderCb({ delta: dt, elapsed: ts, time: simTime });
      context.present();
      animationId = requestAnimationFrame(render);
    };

    context.present();
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  };

  return cbRef;
}
