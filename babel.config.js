/** @type {import('react-native-unistyles/plugin').UnistylesPluginOptions} */
const unistylesOptions = {
  root: './src',
  autoProcessImports: [
    './src/components',
    './src/features',
    './src/typography',
  ],
  debug: process.env.NODE_ENV === 'development',
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
