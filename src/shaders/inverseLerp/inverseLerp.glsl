/**
 * Determine where a value lies within a range.
 * https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Mathf.InverseLerp.html
 * https://docs.unity3d.com/Packages/com.unity.shadergraph@17.2/manual/Inverse-Lerp-Node.html
 */
float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}
