import { tgpu } from 'typegpu';
import * as d from 'typegpu/data';

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
