import { Asset } from 'expo-asset';
import { useCallback, useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';

import { type ShaderName, shaderModules } from '@shaders/modules';
import { withAbort } from '@utils/withAbort';
import { resolveNodeDependencies } from '@utils/resolveNodeDependencies';

const shaderCache = new Map<ShaderName, string>();

async function loadShaderModule(name: ShaderName) {
  if (shaderCache.has(name)) {
    return shaderCache.get(name);
  }

  const module = shaderModules[name].module;

  if (!module) {
    throw new Error(`Shader module not found: ${name}`);
  }

  const file = await Asset.fromModule(module).downloadAsync();

  if (!file.localUri) {
    throw new Error(`Failed to load shader file: ${name}`);
  }

  const shader = await FileSystem.readAsStringAsync(file.localUri);

  shaderCache.set(name, shader);

  return shader;
}

export function useShader(source: string, modules: ShaderName[]) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shader, setShader] = useState<string | null>(null);

  const composeShader = useCallback(
    async (_source: string, _modules: ShaderName[]) => {
      const loadedModules = await Promise.all(
        _modules.map((module) => loadShaderModule(module))
      );

      return loadedModules.concat(_source).join('\n');
    },
    []
  );

  useEffect(() => {
    const abortController = new AbortController();
    const sortedModules = resolveNodeDependencies(shaderModules, modules);

    setLoading(true);
    composeShader(source, sortedModules)
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
  }, [composeShader, modules, source]);

  return {
    error,
    loading,
    shader,
  };
}
