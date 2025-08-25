import { Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';

import { ShaderModule } from '@shaders/modules';

import { useShader } from './useShader';

/**
 * Convenience function that resolves a shader module tree and compiles it into
 * a Skia shader.
 * @param module shader module
 */
export function useSkShader(module: ShaderModule) {
  const { shader, loading, error } = useShader(module);
  const skShader = useMemo(
    () => (shader ? Skia.RuntimeEffect.Make(shader) : null),
    [shader]
  );

  return {
    error,
    loading,
    shader: skShader,
  };
}
