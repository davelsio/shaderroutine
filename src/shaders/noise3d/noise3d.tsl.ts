import * as tsl from 'three/tsl';
import type { ConstNode, Vector3 } from 'three/webgpu';

import { hash3d } from '../hash3d/hash3d.tsl';

export const noise3d = /*@__PURE__*/ tsl.Fn(([p]: [ConstNode<Vector3>]) => {
  const i = tsl.floor(p);
  const f = tsl.fract(p);
  const u = f.mul(f).mul(tsl.sub(3.0, tsl.mul(2.0, f)));

  const s1 = tsl.dot(
    hash3d(i.add(tsl.vec3(0.0, 0.0, 0.0))),
    f.sub(tsl.vec3(0.0, 0.0, 0.0))
  );
  const s2 = tsl.dot(
    hash3d(i.add(tsl.vec3(1.0, 0.0, 0.0))),
    f.sub(tsl.vec3(1.0, 0.0, 0.0))
  );

  const s3 = tsl.dot(
    hash3d(i.add(tsl.vec3(0.0, 1.0, 0.0))),
    f.sub(tsl.vec3(0.0, 1.0, 0.0))
  );
  const s4 = tsl.dot(
    hash3d(i.add(tsl.vec3(1.0, 1.0, 0.0))),
    f.sub(tsl.vec3(1.0, 1.0, 0.0))
  );

  const s5 = tsl.dot(
    hash3d(i.add(tsl.vec3(0.0, 0.0, 1.0))),
    f.sub(tsl.vec3(0.0, 0.0, 1.0))
  );
  const s6 = tsl.dot(
    hash3d(i.add(tsl.vec3(1.0, 0.0, 1.0))),
    f.sub(tsl.vec3(1.0, 0.0, 1.0))
  );

  const s7 = tsl.dot(
    hash3d(i.add(tsl.vec3(0.0, 1.0, 1.0))),
    f.sub(tsl.vec3(0.0, 1.0, 1.0))
  );
  const s8 = tsl.dot(
    hash3d(i.add(tsl.vec3(1.0, 1.0, 1.0))),
    f.sub(tsl.vec3(1.0, 1.0, 1.0))
  );

  const px1 = tsl.mix(s1, s2, u.x);
  const px2 = tsl.mix(s3, s4, u.x);
  const px3 = tsl.mix(s5, s6, u.x);
  const px4 = tsl.mix(s7, s8, u.x);

  return tsl.mix(tsl.mix(px1, px2, u.y), tsl.mix(px3, px4, u.y), u.z);
});
