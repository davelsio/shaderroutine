import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { unwrap } from 'jotai/utils';

import { loadShaderModule } from '@helpers/loadShaderModule';
import { dfsSort } from '@utils/depthFirstSearch';

export type ShaderModule = {
  module: number;
  dependencies?: ShaderModule[];
};

export type ShaderResult<Value> =
  | {
      state: 'loading';
    }
  | {
      state: 'error';
      error: unknown;
    }
  | {
      state: 'success';
      data: Value;
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
  const resolved = dfsSort(module, {
    childrenKey: 'dependencies',
    sortOrder: 'children-first',
  });

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

  return atom<ShaderResult<string>>((get) => {
    let unwrapped: string | undefined;
    try {
      unwrapped = get(unwrap(_atom));
    } catch (error) {
      return {
        state: 'error',
        error: error,
      };
    }

    if (unwrapped === undefined) {
      return {
        state: 'loading',
      };
    }

    return {
      state: 'success',
      data: unwrapped,
    };
  });
});
