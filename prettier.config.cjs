// @ts-check

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
module.exports = {
  printWidth: 80,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@assets/(.*)$',
    '^@components/(.*)$',
    '^@features/(.*)$',
    '^@helpers/(.*)$',
    '^@hooks/(.*)$',
    '^@shaders/(.*)$',
    '^@theme/(.*)$',
    '^@typography/(.*)$',
    '^@utils/(.*)$',
    '',
    '^[./](?!.*\\.glsl$)(?!.*\\.css$)(?!.*\\.styles$).*',
    '',
    '^[./].*\\.glsl$',
    '',
    '.*\\.styles(\\.ts)?$',
    '.*\\.css$',
  ],
  plugins: [require.resolve('@ianvs/prettier-plugin-sort-imports')],
};
