/**
 * Template literal tag to trigger syntax highlighting for GLSL strings.
 * @param t template string
 */
export function glsl(t: TemplateStringsArray) {
  return t.join('');
}
