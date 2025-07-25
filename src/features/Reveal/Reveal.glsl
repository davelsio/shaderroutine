uniform shader image1;
uniform shader image2;

uniform vec2 uResolution;
uniform float uProgress;

vec4 main(vec2 pxCoords) {
  vec2 uv = pxCoords / uResolution;

  // Animated effect
  float diagonal = length(uResolution); // [vec2(top, left), vec2(bottom, right)]
  float duration = 1.0;
  float size = smoothstep(0.0, duration, uProgress) * diagonal * 1.1;
  float noise = fbm(vec3(pxCoords, 0.0) * 0.005, 0.5, 2.0);
  float d = sdfCircle(pxCoords + 50.0 * noise, size); // expanding circle
  // float d = sdfCircle(pxCoords * noise * 0.7, size * 0.2); // dissolve

  // Initial textures
  vec3 diffuse1 = image1.eval(pxCoords).xyz;
  vec3 diffuse2 = image2.eval(pxCoords).xyz;
  vec3 color = diffuse1;

  // Transition
  color = mix(color, diffuse2, smoothstep(1.0, 0.0, d));

  // Blur effect
  float blurAmount = 1.0 - exp(-d * d * 0.001);
  color = mix(diffuse1, color, blurAmount);

  return vec4(color, 1.0);
}