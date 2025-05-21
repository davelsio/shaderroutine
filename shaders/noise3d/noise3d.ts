import type { ShaderModule } from '../modules';
import { hash3d } from '../hash3d';

export const noise3d: ShaderModule = {
  module: require('./noise3d.glsl'),
  dependencies: [hash3d],
};
