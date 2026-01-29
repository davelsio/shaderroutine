import { tgpu } from 'typegpu';
import * as d from 'typegpu/data';
import * as std from 'typegpu/std';

import { inverseLerp } from '../inverseLerp/inverseLerp.tgpu';

export const remap = tgpu.fn(
  [d.f32, d.f32, d.f32, d.f32, d.f32],
  d.f32
)((v, inMin, inMax, outMin, outMax) => {
  'use gpu';
  const t = inverseLerp(v, inMin, inMax);
  return std.mix(outMin, outMax, t);
});
