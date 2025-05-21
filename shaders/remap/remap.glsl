/**
  * Linearly interpolate a value from one range to another.
  * https://docs.unity3d.com/Packages/com.unity.shadergraph@17.2/manual/Remap-Node.html
  */
float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}
