export type ShaderModule = {
  module: number;
  dependencies?: ShaderModule[];
};
