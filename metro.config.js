/**
 * Relevant Expo documentation.
 * @see https://docs.expo.io/guides/customizing-metro
 * @see https://docs.expo.dev/guides/monorepos
 * @see https://docs.expo.dev/versions/latest/config/metro/#es-module-resolution
 * @see https://docs.swmansion.com/react-native-reanimated/docs/debugging/accurate-call-stacks/
 */

// const path = require('path');

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

// const threePackagePath = path.resolve(__dirname, 'node_modules/three');
// const r3fPath = path.resolve(__dirname, 'node_modules/@react-three/fiber');

// config.resolver.extraNodeModules = {
//   three: threePackagePath,
// };

config.resolver.extraNodeModules = {};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force 'three' to webgpu build
  if (moduleName === 'three') {
    moduleName = 'three/webgpu';
  }

  // Use the standard react-three/fiber instead of the React Native version since webgpu is giving us a more w3c spec-compliant runtime.
  if (platform !== 'web' && moduleName.startsWith('@react-three/fiber')) {
    return context.resolveRequest(
      {
        ...context,
        // Ignores the `react-native` field.
        unstable_conditionNames: ['module'],
        mainFields: ['module'],
      },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

/**
 * Uncomment to opt-out of the new ES Modules resolution.
 * @see https://docs.expo.dev/versions/latest/config/metro/#es-module-resolution
 */
// config.resolver.unstable_enablePackageExports = false;

module.exports = wrapWithReanimatedMetroConfig(config);
