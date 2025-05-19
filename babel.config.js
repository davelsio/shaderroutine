/** @type {import('react-native-unistyles/plugin').UnistylesPluginOptions} */
const unistylesOptions = {
  autoProcessRoot: '.',
  debug: __DEV__,
};

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-unistyles/plugin', unistylesOptions],
      'react-native-reanimated/plugin',
    ],
  };
};
