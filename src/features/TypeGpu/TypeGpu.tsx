/**
 * Adapted from https://docs.swmansion.com/TypeGPU/examples/#example=rendering--caustics
 */

import { Canvas } from 'react-native-wgpu';

import { useTypeGPU } from '@hooks/useTypeGPU';

import { createFragmentShader } from './TypeGpu.frag';
import style from './TypeGpu.styles';
import { mainVertex } from './TypeGpu.vert';

export function TypeGpu() {
  const cbRef = useTypeGPU(
    ({ canvas, context, device, gpu, presentationFormat, root }) => {
      const { mainFragment, uniforms } = createFragmentShader(root);

      // First render
      const pipeline = root['~unstable']
        .withVertex(mainVertex, {})
        .withFragment(mainFragment, { format: presentationFormat })
        .createPipeline();

      // Animation loop
      return ({ delta, time }) => {
        uniforms.time.write(time);

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
