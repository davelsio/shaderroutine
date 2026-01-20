import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { loadable } from 'jotai/utils';

import { loadShaderModule } from '@helpers/loadShaderModule';
import { dfsSort } from '@utils/depthFirstSearch';

export type ShaderModule = {
  module: number;
  dependencies?: ShaderModule[];
};

/**
 * Jotai atom family of shaders.
 *
 * The atom resolves the shader module dependency tree and composes the final
 * shader. Modules are cached and reused.
 *
 * @param module shader module
 */
export const shaderFamily = atomFamily((module: ShaderModule) => {
  const shaderCache = new Map<number, string>();
  const resolved = dfsSort(module);

  const _atom = atom(async () => {
    const loadedModules = await Promise.all(
      resolved.map(async ({ module }) => {
        if (shaderCache.has(module)) {
          return shaderCache.get(module)!;
        }

        const shader = await loadShaderModule(module);
        shaderCache.set(module, shader);

        return shader;
      })
    );

    return loadedModules.join('\n');
  });

  return loadable(_atom);
});
