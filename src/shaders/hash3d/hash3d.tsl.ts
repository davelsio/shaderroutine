import * as tsl from 'three/tsl';
import type { ConstNode, Vector3 } from 'three/webgpu';

export const hash3d = /*@__PURE__*/ tsl.Fn(
  ([p]: [ConstNode<'vec3', Vector3>]) => {
    const v = tsl.vec3(
      tsl.dot(p, tsl.vec3(127.1, 311.7, 74.7)),
      tsl.dot(p, tsl.vec3(269.5, 183.3, 246.1)),
      tsl.dot(p, tsl.vec3(113.5, 271.9, 124.6))
    );

    const sv = tsl.vec3(tsl.sin(v.x), tsl.sin(v.y), tsl.sin(v.z));

    return tsl.negate(
      tsl.add(1.0, tsl.mul(2.0, tsl.fract(tsl.mul(sv, 43758.5453123))))
    );
  }
);
