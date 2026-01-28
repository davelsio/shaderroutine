//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

import * as d from 'typegpu/data';
import * as std from 'typegpu/std';

function permute_float(x: number): number {
  'use gpu';
  return std.floor(std.mod((x * 34.0 + 1.0) * x, 289.0));
}

function permute_vec4(x: d.v4f): d.v4f {
  'use gpu';
  return std.mod(x.mul(34.0).add(1.0).mul(x), 289.0);
}

function taylorInvSqrt_float(r: number): number {
  'use gpu';
  return 1.79284291400159 - 0.85373472095314 * r;
}

function taylorInvSqrt_vec4(r: d.v4f): d.v4f {
  'use gpu';
  return std.sub(1.79284291400159, r.mul(0.85373472095314));
}

function grad4(j: number, ip: d.v4f): d.v4f {
  'use gpu';
  const ones = d.vec4f(1.0, 1.0, 1.0, -1.0);

  let p_xyz = std
    .floor(std.fract(d.vec3f(j).mul(ip.xyz)).mul(7.0))
    .mul(ip.z)
    .sub(1.0);
  const p_w = 1.5 - std.dot(std.abs(p_xyz), ones.xyz);
  const p = d.vec4f(p_xyz, p_w);

  const s = std.select(d.vec4f(0.0), d.vec4f(1.0), std.lt(p, d.vec4f(0.0)));

  p_xyz = p.xyz.add(s.xyz.mul(2.0).sub(1.0).mul(s.www));

  return d.vec4f(p_xyz, p_w);
}

export function simplexNoise4d(v: d.v4f): number {
  'use gpu';

  const C = d.vec2f(
    0.138196601125010504, // (5 - sqrt(5))/20  G4
    0.309016994374947451 // (sqrt(5) - 1)/4   F4
  );

  // First corner
  let i = std.floor(v.add(std.dot(v, C.yyyy)));
  const x0 = v.sub(i).add(std.dot(i, C.xxxx));

  // Other corners

  // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  const isX = std.step(x0.yzw, x0.xxx);
  const isYZ = std.step(x0.zww, x0.yyz);

  const i0 = d.vec4f(
    isX.x + isX.y + isX.z,
    1.0 - isX.x + isYZ.x + isYZ.y,
    1.0 - isX.y + (1.0 - isYZ.x) + isYZ.z,
    1.0 - isX.z + (1.0 - isYZ.y) + (1.0 - isYZ.z)
  );

  // i0 now contains the unique values 0,1,2,3 in each channel
  const i3 = std.clamp(i0, d.vec4f(0.0), d.vec4f(1.0));
  const i2 = std.clamp(i0.sub(1.0), d.vec4f(0.0), d.vec4f(1.0));
  const i1 = std.clamp(i0.sub(2.0), d.vec4f(0.0), d.vec4f(1.0));

  //  x0 = x0 - 0.0 + 0.0 * C
  const x1 = x0.sub(i1).add(C.xxxx.mul(1.0));
  const x2 = x0.sub(i2).add(C.xxxx.mul(2.0));
  const x3 = x0.sub(i3).add(C.xxxx.mul(3.0));
  const x4 = x0.sub(1.0).add(C.xxxx.mul(4.0));

  // Permutations
  i = std.mod(i, d.vec4f(289.0));

  const j0 = permute_float(
    permute_float(permute_float(permute_float(i.w) + i.z) + i.y) + i.x
  );

  const j1 = permute_vec4(
    permute_vec4(
      permute_vec4(
        permute_vec4(d.vec4f(i1.w, i2.w, i3.w, 1.0).add(i.w))
          .add(i.z)
          .add(d.vec4f(i1.z, i2.z, i3.z, 1.0))
      )
        .add(i.y)
        .add(d.vec4f(i1.y, i2.y, i3.y, 1.0))
    )
      .add(i.x)
      .add(d.vec4f(i1.x, i2.x, i3.x, 1.0))
  );

  // Gradients
  // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
  // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

  const ip = d.vec4f(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0);
  let p0 = grad4(j0, ip);
  let p1 = grad4(j1.x, ip);
  let p2 = grad4(j1.y, ip);
  let p3 = grad4(j1.z, ip);
  let p4 = grad4(j1.w, ip);

  // Normalise gradients
  const norm = taylorInvSqrt_vec4(
    d.vec4f(std.dot(p0, p0), std.dot(p1, p1), std.dot(p2, p2), std.dot(p3, p3))
  );
  p0 = p0.mul(norm.x);
  p1 = p1.mul(norm.y);
  p2 = p2.mul(norm.z);
  p3 = p3.mul(norm.w);
  p4 = p4.mul(taylorInvSqrt_float(std.dot(p4, p4)));

  // Mix contributions from the five corners
  let m0 = std.max(
    d
      .vec3f(0.6)
      .sub(d.vec3f(std.dot(x0, x0), std.dot(x1, x1), std.dot(x2, x2))),
    d.vec3f(0.0)
  );
  let m1 = std.max(
    d.vec2f(0.6).sub(d.vec2f(std.dot(x3, x3), std.dot(x4, x4))),
    d.vec2f(0.0)
  );

  m0 = m0.mul(m0);
  m1 = m1.mul(m1);

  return (
    49.0 *
    (std.dot(
      m0.mul(m0),
      d.vec3f(std.dot(p0, x0), std.dot(p1, x1), std.dot(p2, x2))
    ) +
      std.dot(m1.mul(m1), d.vec2f(std.dot(p3, x3), std.dot(p4, x4))))
  );
}
