/**
 * Increase an index within a loop.
 * @param index current index
 * @param length loop length
 */
export const loopForward = (index: number, length: number) => {
  'worklet';
  return (index + 1) % length;
};

/**
 * Decrease an index within a loop.
 * @param index current index
 * @param length loop length
 */
export const loopBackward = (index: number, length: number) => {
  'worklet';
  return (index - 1 + length) % length;
};
