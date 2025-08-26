import { hash3d } from '../hash3d';
import type { ShaderModule } from '../modules';

export const noise3d: ShaderModule = {
  module: require('./noise3d.glsl'),
  dependencies: [hash3d],
};
