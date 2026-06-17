import { Skia, type SkRuntimeEffect } from '@shopify/react-native-skia';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import {
  shaderFamily,
  type ShaderModule,
  type ShaderResult,
} from '@shaders/modules';

/**
 * Resolve a shader module into a shader string.
 * @param module shader module
 */
export function useShader(module: ShaderModule) {
  return useAtomValue(shaderFamily(module));
}

/**
 * Resolve and compile a shader module as a Skia runtime effect.
 * @param module shader module
 */
export function useSkShader(module: ShaderModule) {
  const shader = useShader(module);
  return useMemo<ShaderResult<SkRuntimeEffect>>(() => {
    if (shader.state !== 'success') {
      return shader;
    }

    let skShader: SkRuntimeEffect | null = null;
    let error: unknown;

    try {
      skShader = Skia.RuntimeEffect.Make(shader.data);
    } catch (err) {
      error = err;
    }

    if (!skShader) {
      return {
        state: 'error',
        error: error ?? new Error('Error compiling the Skia shader'),
      };
    }

    return {
      ...shader,
      data: skShader,
    };
  }, [shader]);
}
