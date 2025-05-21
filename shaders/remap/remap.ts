import type { ShaderModule } from '../modules';
import { inverseLerp } from '../inverseLerp';

export const remap: ShaderModule = {
  module: require('./remap.glsl'),
  dependencies: [inverseLerp],
};
