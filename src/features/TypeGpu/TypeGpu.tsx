/**
 * Adapted from https://docs.swmansion.com/TypeGPU/examples/#example=rendering--caustics
 */

import { Canvas } from 'react-native-webgpu';

import { useTypeGPU } from '@hooks/useTypeGPU';

import { createFragmentShader } from './TypeGpu.frag';
import { mainVertex } from './TypeGpu.vert';

import style from './TypeGpu.styles';

export function TypeGpu() {
  const cbRef = useTypeGPU(
    ({ canvas, context, device, gpu, presentationFormat, root }) => {
      const { mainFragment, uniforms } = createFragmentShader(root);

      // First render
      const pipeline = root.createRenderPipeline({
        vertex: mainVertex,
        fragment: mainFragment,
        targets: { format: presentationFormat },
      });

      // Animation loop
      return ({ elapsed }) => {
        uniforms.time.write(elapsed);

        pipeline
          .withColorAttachment({
            view: context.getCurrentTexture().createView(),
            clearValue: [0, 0, 0, 0],
            loadOp: 'clear',
            storeOp: 'store',
          })
          .draw(3);
      };
    }
  );

  return <Canvas ref={cbRef} style={style.canvas} transparent />;
}
