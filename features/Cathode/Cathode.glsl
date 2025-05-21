uniform shader image;
uniform vec2 uResolution;
uniform float uTime;

vec4 main(vec2 pxCoords) {
  vec4 texture = image.eval(pxCoords);
  vec3 color = texture.xyz;
  vec2 uv = pxCoords / uResolution;

  // Thin bars scrolling downwards
  float t1 = remap(sin(uv.y * 400.0 + uTime * 10.0), -1.0, 1.0, 0.9, 1.0);
  // Thick bars scrolling upwards
  float t2 = remap(sin(uv.y * 50.0 - uTime * 8.0), -1.0, 1.0, 0.9, 1.0);
  // Blend the moving bars into the texture
  color = color * t1 * t2;

  // return vec4(uv.x, uv.y, 1.0, 1.0);
  return vec4(color, 1.0);
}