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
    rules: {
      // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@*/**',
              group: 'parent',
              position: 'before',
            },
          ],
          distinctGroup: true,
        },
      ],

      // Disable the array notation police
      '@typescript-eslint/array-type': 'off',

      // Disable empty interface warnings in module augmentation
      '@typescript-eslint/no-empty-object-type': 'off',
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
]);
