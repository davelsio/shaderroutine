# ShaderRoutine Project

## Project Structure

### Folders

- `src/app`: file-based routing, no logic, only imports features.
- `src/components`: reusable UI elements, encapsulated in folders.
- `src/features`: individual features for each route stack.
- `src/helpers`: domain helpers.
- `src/hooks`: core functionality.
- `src/shaders`: generic shader code.
- `src/theme`: style variables and themes.
- `src/utils`: domain-agnostic utils.
- `src/typography`: text-rendering components.

### Exports

- All component, feature, and typography folders expose a top `index.ts` file that exports the main component, and if they exist, also types and state.
- All `src/helpers` and `src/utils` are exported as individual files.
- Shaders are encapsulated in folders and exported as a `ShaderModule` (`src/shaders/modules.ts`), to be later consumed via the `src/hooks/useShader.ts` and `src/hooks/useSkShader.ts` hooks.

  ```ts
  // index.ts
  export * from './SomeComponentOrFeature';
  export * from './SomeTypes';
  export * from './SomeState';
  ```

## Engineering Guide

### Components

- Always prefer `function` to `const` when defining new components or helper functions.
- The React Compiler is configured for automatic optimization. When manual optimization is required, wrap event handlers and expensive computations in `useCallback` and `useMemo`, respectively.

### Styles

- Use `StyleSheet.create` from `react-native-unistyles`.
- Create separate `*.styles.ts` files with a `default` export.
- A single tyles export may cover several components. Be judicious, if the object starts to be too large or complex, separate the styles into one file per component.
