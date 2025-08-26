import type { ShaderModule } from '../modules';
import { noise3d } from '../noise3d';

export const fbm: ShaderModule = {
  module: require('./fbm.glsl'),
  dependencies: [noise3d],
};
