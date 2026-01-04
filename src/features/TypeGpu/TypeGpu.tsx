/**
 * Adapted from https://docs.swmansion.com/TypeGPU/examples/#example=rendering--caustics
 */

import { useClock } from '@shopify/react-native-skia';
import { useCallback } from 'react';
import { Canvas, useDevice, type CanvasRef } from 'react-native-wgpu';
import { tgpu } from 'typegpu';

import { createFragmentShader } from './TypeGpu.frag';
import style from './TypeGpu.styles';
import { mainVertex } from './TypeGpu.vert';

export function TypeGpu() {
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  const { device } = useDevice();
  const clock = useClock();

  const cbRef = useCallback(
    (ref: CanvasRef | null) => {
      const context = ref?.getContext('webgpu');

      if (!device || !context) {
        return;
      }

      const root = tgpu.initFromDevice({ device });

      // const surface = context.canvas;
      // const pxRatio = PixelRatio.get();
      // surface.width = surface.width * pxRatio;
      // surface.height = surface.height * pxRatio;

      context.configure({
        device: device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      });

      const { mainFragment, uniforms } = createFragmentShader(root);

      // Rendering pipeline
      const pipeline = root['~unstable']
        .withVertex(mainVertex, {})
        .withFragment(mainFragment, { format: presentationFormat })
        .createPipeline();

      let animationId: number;

      // Animation loop
      const animate = () => {
        uniforms.time.write(clock.value / 1000);

        pipeline
          .withColorAttachment({
            view: context.getCurrentTexture().createView(),
            clearValue: [0, 0, 0, 0],
            loadOp: 'clear',
            storeOp: 'store',
          })
          .draw(3);

        context.present();
        animationId = requestAnimationFrame(animate);
      };

      context.present();
      animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
      };
    },
    [clock, device, presentationFormat]
  );

  return <Canvas ref={cbRef} style={style.canvas} transparent />;
}
