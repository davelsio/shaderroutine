/* eslint-env node */

/**
 * Relevant Expo documentation.
 * @see https://docs.expo.io/guides/customizing-metro
 * @see https://docs.expo.dev/guides/monorepos
 * @see https://docs.expo.dev/versions/latest/config/metro/#es-module-resolution
 * @see https://docs.swmansion.com/react-native-reanimated/docs/debugging/accurate-call-stacks/
 */

const { getDefaultConfig } = require('expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Custom config
});

// Support shader extensions
config.resolver.assetExts.push('glsl', 'sksl');

/**
 * Uncomment to opt-out of the new ES Modules resolution.
 * @see https://docs.expo.dev/versions/latest/config/metro/#es-module-resolution
 */
// config.resolver.unstable_enablePackageExports = false;

module.exports = wrapWithReanimatedMetroConfig(config);
