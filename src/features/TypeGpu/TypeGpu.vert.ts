import { tgpu } from 'typegpu';
import * as d from 'typegpu/data';

// export const mainVertex = tgpu['~unstable'].vertexFn({
//   in: { vertexIndex: d.builtin.vertexIndex },
//   out: { outPos: d.builtin.position, uv: d.vec2f },
// }) /* wgsl */ `{
//   var pos = array<vec2f, 3>(vec2(0.0, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5));
//   var uv = array<vec2f, 3>(vec2(0.5, 1.0), vec2(0.0, 0.0), vec2(1.0, 0.0));
//   return Out(vec4f(pos[in.vertexIndex], 0.0, 1.0), uv[in.vertexIndex]);
// }`;

export const mainVertex = tgpu['~unstable'].vertexFn({
  in: { vertexIndex: d.builtin.vertexIndex },
  out: { pos: d.builtin.position, uv: d.vec2f },
})(({ vertexIndex }) => {
  const pos = [d.vec2f(0, 0.8), d.vec2f(-0.8, -0.8), d.vec2f(0.8, -0.8)];
  const uv = [d.vec2f(0.5, 1), d.vec2f(0, 0), d.vec2f(1, 0)];

  return {
    pos: d.vec4f(pos[vertexIndex], 0, 1),
    uv: uv[vertexIndex],
  };
});
