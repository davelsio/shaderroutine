# ShaderRoutine Project

## Project Architecture

### Folder Structure

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

  ```ts
  // index.ts
  export * from './SomeComponentOrFeature';
  export * from './SomeTypes';
  export * from './SomeState';
  ```

### Shaders

- Shaders are encapsulated in folders and exported as a `ShaderModule` (`src/shaders/modules.ts`)
- Shaders may exist as `sksl`, `glsl`, `tsl`, and `tgpu` variants.
- GLSL and SKSL shaders are loaded and composed through the `src/hooks/useShader.ts` and `src/hooks/useSkShader.ts` hooks.

## Coding Style

### Components

- Components and helpers are declared as `function`.

### Styles

- `StyleSheet.create` from `react-native-unistyles`.
- Separate `*.styles.ts` files with a `default` export.
- A single `styles` object may cover several simple components or be separated into one file per component when complexity increases.
