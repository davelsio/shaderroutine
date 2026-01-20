import { Skia } from '@shopify/react-native-skia';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { shaderFamily, type ShaderModule } from '@shaders/modules';

/**
 * Convenience hook to resolve the shader module tree into a single string.
 * @param module shader module
 */
export function useShader(module: ShaderModule) {
  return useAtomValue(shaderFamily(module));
}

/**
 * Convenience hook to resolve and compile a shader as a Skia runtime effect.
 * @param module shader module
 */
export function useSkShader(module: ShaderModule) {
  const shader = useShader(module);
  const skShader = useMemo(
    () =>
      shader.state === 'hasData' ? Skia.RuntimeEffect.Make(shader.data) : null,
    [shader]
  );

  return {
    error: shader.state === 'hasError' ? shader.error : null,
    loading: shader.state === 'loading',
    shader: skShader,
  };
}
