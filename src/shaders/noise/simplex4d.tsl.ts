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

import * as tsl from 'three/tsl';
import * as THREE from 'three/webgpu';
import { ConstNode } from 'three/webgpu';

const permute_float = /*@__PURE__*/ tsl.Fn(
  ([x]: [ConstNode<'float', number>]) => {
    return tsl.floor(tsl.mod(x.mul(34.0).add(1.0).mul(x), 289.0));
  },
  { x: 'float', return: 'float' }
);

const permute_vec4 = /*@__PURE__*/ tsl.Fn(
  ([x]: [ConstNode<'vec4', THREE.Vector4>]) => {
    return tsl.mod(x.mul(34.0).add(1.0).mul(x), 289.0);
  },
  { x: 'vec4', return: 'vec4' }
);

const taylorInvSqrt_float = /*@__PURE__*/ tsl.Fn(
  ([r]: [ConstNode<'float', number>]) => {
    return tsl.sub(1.79284291400159, tsl.mul(0.85373472095314, r));
  },
  { r: 'float', return: 'float' }
);

const taylorInvSqrt_vec4 = /*@__PURE__*/ tsl.Fn(
  ([r]: [ConstNode<'vec4', THREE.Vector4>]) => {
    return tsl.sub(1.79284291400159, tsl.mul(0.85373472095314, r));
  },
  { r: 'vec4', return: 'vec4' }
);

const grad4 = /*@__PURE__*/ tsl.Fn(
  ([j, ip]: [ConstNode<'float', number>, ConstNode<'vec4', THREE.Vector4>]) => {
    const ones = tsl.vec4(1.0, 1.0, 1.0, -1.0);
    const p = tsl.property('vec4');
    const s = tsl.property('vec4');
    p.xyz.assign(
      tsl
        .floor(tsl.fract(tsl.vec3(j).mul(ip.xyz)).mul(7.0))
        .mul(ip.z)
        .sub(1.0)
    );
    p.w.assign(tsl.sub(1.5, tsl.dot(tsl.abs(p.xyz), ones.xyz)));
    s.assign(
      tsl.vec4(
        tsl.select(p.x.lessThan(0.0), 1.0, 0.0),
        tsl.select(p.y.lessThan(0.0), 1.0, 0.0),
        tsl.select(p.z.lessThan(0.0), 1.0, 0.0),
        tsl.select(p.w.lessThan(0.0), 1.0, 0.0)
      )
    );
    p.xyz.assign(p.xyz.add(s.xyz.mul(2.0).sub(1.0).mul(s.www)));

    return p;
  },
  { j: 'float', ip: 'vec4', return: 'vec4' }
);

export const simplexNoise4d = /*@__PURE__*/ tsl.Fn(
  ([v]: [ConstNode<'vec4', THREE.Vector4>]) => {
    const C = tsl.vec2(
      0.138196601125010504, // (5 - sqrt(5))/20  G4
      0.309016994374947451 // (sqrt(5) - 1)/4   F4
    );

    // First corner
    const i = tsl.floor(v.add(tsl.dot(v, C.yyyy)));
    const x0 = v.sub(i).add(tsl.dot(i, C.xxxx));

    // Other corners

    // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
    const i0 = tsl.property('vec4');
    const isX = tsl.vec3(
      tsl.step(x0.y, x0.x),
      tsl.step(x0.z, x0.x),
      tsl.step(x0.w, x0.x)
    );
    const isYZ = tsl.vec3(
      tsl.step(x0.z, x0.y),
      tsl.step(x0.w, x0.y),
      tsl.step(x0.w, x0.z)
    );
    //  i0.x = dot( isX, vec3( 1.0 ) );
    i0.x.assign(isX.x.add(isX.y).add(isX.z));
    i0.yzw.assign(tsl.sub(1.0, isX));
    //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
    i0.y.addAssign(isYZ.x.add(isYZ.y));
    i0.zw.addAssign(tsl.sub(1.0, isYZ.xy));
    i0.z.addAssign(isYZ.z);
    i0.w.addAssign(tsl.sub(1.0, isYZ.z));

    // i0 now contains the unique values 0,1,2,3 in each channel
    const i3 = tsl.clamp(i0, 0.0, 1.0);
    const i2 = tsl.clamp(i0.sub(1.0), 0.0, 1.0);
    const i1 = tsl.clamp(i0.sub(2.0), 0.0, 1.0);

    //  x0 = x0 - 0.0 + 0.0 * C
    const x1 = x0.sub(i1).add(tsl.mul(1.0, C.xxxx));
    const x2 = x0.sub(i2).add(tsl.mul(2.0, C.xxxx));
    const x3 = x0.sub(i3).add(tsl.mul(3.0, C.xxxx));
    const x4 = x0.sub(1.0).add(tsl.mul(4.0, C.xxxx));

    // Permutations
    i.assign(tsl.mod(i, 289.0));
    const j0 = permute_float(
      permute_float(permute_float(permute_float(i.w).add(i.z)).add(i.y)).add(
        i.x
      )
    );
    const j1 = permute_vec4(
      permute_vec4(
        permute_vec4(
          permute_vec4(i.w.add(tsl.vec4(i1.w, i2.w, i3.w, 1.0)))
            .add(i.z)
            .add(tsl.vec4(i1.z, i2.z, i3.z, 1.0))
        )
          .add(i.y)
          .add(tsl.vec4(i1.y, i2.y, i3.y, 1.0))
      )
        .add(i.x)
        .add(tsl.vec4(i1.x, i2.x, i3.x, 1.0))
    );

    // Gradients
    // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
    const ip = tsl.vec4(1.0 / 294.0, 1.0 / 49.0, 1.0 / 7.0, 0.0);
    const p0 = grad4(j0, ip);
    const p1 = grad4(j1.x, ip);
    const p2 = grad4(j1.y, ip);
    const p3 = grad4(j1.z, ip);
    const p4 = grad4(j1.w, ip);

    // Normalise gradients
    const norm = taylorInvSqrt_vec4(
      tsl.vec4(
        tsl.dot(p0, p0),
        tsl.dot(p1, p1),
        tsl.dot(p2, p2),
        tsl.dot(p3, p3)
      )
    );
    p0.mulAssign(norm.x);
    p1.mulAssign(norm.y);
    p2.mulAssign(norm.z);
    p3.mulAssign(norm.w);
    p4.mulAssign(taylorInvSqrt_float(tsl.dot(p4, p4)));

    // Mix contributions from the five corners
    const m0 = tsl.max(
      tsl.sub(0.6, tsl.vec3(tsl.dot(x0, x0), tsl.dot(x1, x1), tsl.dot(x2, x2))),
      0.0
    );
    const m1 = tsl.max(
      tsl.sub(0.6, tsl.vec2(tsl.dot(x3, x3), tsl.dot(x4, x4))),
      0.0
    );
    m0.assign(m0.mul(m0));
    m1.assign(m1.mul(m1));

    return tsl.mul(
      49.0,
      tsl
        .dot(
          m0.mul(m0),
          tsl.vec3(tsl.dot(p0, x0), tsl.dot(p1, x1), tsl.dot(p2, x2))
        )
        .add(tsl.dot(m1.mul(m1), tsl.vec2(tsl.dot(p3, x3), tsl.dot(p4, x4))))
    );
  }
);
