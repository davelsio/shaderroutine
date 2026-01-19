import { inverseLerp } from '../inverseLerp/inverseLerp.module';
import type { ShaderModule } from '../modules';

export const remap: ShaderModule = {
  module: require('./remap.glsl'),
  dependencies: [inverseLerp],
};
