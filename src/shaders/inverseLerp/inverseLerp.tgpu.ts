import { tgpu } from 'typegpu';
import * as d from 'typegpu/data';

export const inverseLerp = tgpu.fn(
  [d.f32, d.f32, d.f32],
  d.f32
)((v, minValue, maxValue) => {
  'use gpu';
  return (v - minValue) / (maxValue - minValue);
});
