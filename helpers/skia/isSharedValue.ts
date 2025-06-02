import { SharedValue } from 'react-native-reanimated';

export function isSharedValue<T extends unknown>(
  u: T | SharedValue<T>
): u is SharedValue<T> {
  return (u as SharedValue<T>).value !== undefined;
}

export function resolveValue<T>(u: T | SharedValue<T>): T {
  return isSharedValue<T>(u) ? u.value : u;
}
