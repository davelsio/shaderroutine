import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { useEffect, useState } from 'react';

import type { ShaderModule } from '@shaders/modules';
import { dfsSort } from '@utils/depthFirstSearch';
import { withAbort } from '@utils/withAbort';

const shaderCache = new Map<number, string>();

/**
 * Resolve a shader module tree and its depedencies into a final string that
 * can be consumed by the appropriate compiler.
 * @param module shader module
 */
export function useShader(module: ShaderModule) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shader, setShader] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);
    composeShader(module)
      .then((shader) => {
        withAbort(() => setShader(shader), abortController);
      })
      .catch((error) => {
        withAbort(() => setError(error.message), abortController);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [module]);

  return {
    error,
    loading,
    shader,
  };
}

/**
 * Compose a shader module tree into its final shader, ready for consumption.
 * Dependencies are resolved using a DFS algortihm and then appended to the
 * shader string in preserved order.
 * @param tree shader module
 */
async function composeShader(tree: ShaderModule) {
  const resolved = dfsSort(tree);

  const loadedModules = await Promise.all(
    resolved.map(({ module }) => loadShaderModule(module))
  );

  return loadedModules.join('\n');
}

/**
 * Load a shader module asset from file or cache.
 * @param module shader module
 */
async function loadShaderModule(module: number) {
  if (shaderCache.has(module)) {
    return shaderCache.get(module)!;
  }

  if (!module) {
    throw new Error(`Shader module not found: ${module}`);
  }

  const file = await Asset.fromModule(module).downloadAsync();

  if (!file.localUri) {
    throw new Error(`Failed to load shader file: ${file.name}`);
  }

  const shader = await new File(file.localUri).text();

  shaderCache.set(module, shader);

  return shader;
}
