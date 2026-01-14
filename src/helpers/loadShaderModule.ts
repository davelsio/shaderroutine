import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';

/**
 * Load a shader module asset from a local file.
 * @param module shader module
 */
export async function loadShaderModule(module: number) {
  if (!module) {
    throw new Error(`Shader module not found: ${module}`);
  }

  const file = await Asset.fromModule(module).downloadAsync();

  if (!file.localUri) {
    throw new Error(`Failed to load shader file: ${file.name}`);
  }

  const shader = await new File(file.localUri).text();

  return shader;
}
