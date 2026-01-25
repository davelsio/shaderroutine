const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');

module.exports = defineConfig([
  /**
   * Global ignores
   * https://eslint.org/docs/latest/use/configure/ignore#ignoring-files
   */
  {
    ignores: [
      // compiled project
      'dist/*',
      // static assets folder
      'public/*',
    ],
  },
  /**
   * Expo config
   * https://docs.expo.dev/guides/using-eslint/
   * https://github.com/expo/expo/tree/main/packages/eslint-config-expo/utils
   */
  expoConfig,
  /**
   * Custom project rules
   */
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // Disable unknown property warnings for R3F components
      'react/no-unknown-property': 'off',

      // Disable the array notation police
      '@typescript-eslint/array-type': 'off',

      // Disable empty interface warnings in module augmentation
      '@typescript-eslint/no-empty-object-type': 'off',

      // Allow sharing component and interface names
      '@typescript-eslint/no-redeclare': 'off',

      // Extend Expo config to allow GLSL files
      // https://github.com/expo/expo/blob/main/packages/eslint-config-expo/utils/typescript.js#L59
      '@typescript-eslint/no-require-imports': [
        'warn',
        {
          allow: [
            '\\.(aac|aiff|avif|bmp|caf|db|gif|glsl|heic|html|jpeg|jpg|json|m4a|m4v|mov|mp3|mp4|mpeg|mpg|otf|pdf|png|psd|sksl|svg|ttf|wav|webm|webp|xml|yaml|yml|zip)$',
          ],
        },
      ],
    },
  },
  /**
   * Configure Jest globals in relevant files.
   * https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
   */
  {
    files: ['**/*.test.{ts,tsx}', '**/jest.setup.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  // Allow `require` imports in JS files.
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
