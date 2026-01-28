import type {
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
} from 'three/webgpu';

export function isValidCamera(camera: Camera) {
  return (
    (camera as PerspectiveCamera).isPerspectiveCamera ||
    (camera as OrthographicCamera).isOrthographicCamera
  );
}
