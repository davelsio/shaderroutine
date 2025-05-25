export type SkVector3 = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

/**
 * Skia helper that emulates the core vec interface, but for 3D vectors.
 * @param x x component
 * @param y y component
 * @param z z component
 */
export function vec3(x: number, y: number, z: number) {
  'worklet';
  const arr = [x, y, z];
  Object.assign(arr, { x, y, z });
  return arr as unknown as SkVector3;
}
