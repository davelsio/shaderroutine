export type ShaderName = 'inverseLerp' | 'remap';

export type ShaderModule = {
  module: number;
  dependencies?: ShaderName[];
};

export const shaderModules: Record<ShaderName, ShaderModule> = {
  inverseLerp: {
    module: require('./glsl/inverseLerp.glsl'),
  },
  remap: {
    module: require('./glsl/remap.glsl'),
    dependencies: ['inverseLerp'],
  },
};
