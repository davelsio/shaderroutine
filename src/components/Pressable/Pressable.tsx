/**
 * Wrapper around the GestureHandler Pressable component to avoid issues with
 * Reanimated feature flags.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags/#android_synchronously_update_ui_props
 * @see https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags/#ios_synchronously_update_ui_props
 */
export { Pressable, type PressableProps } from 'react-native-gesture-handler';
