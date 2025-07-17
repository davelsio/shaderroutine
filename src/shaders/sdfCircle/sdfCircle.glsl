float sdfCircle(vec2 point, float radius) {
  // length is always a positive value -> sqrt(x[0]^2 + x[2]^2)
  return length(point) - radius;
}
