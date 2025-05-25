<h1 align="center">Shader Routine</h1>
<p align="center"><i>Isolated experiments with shaders in React Native</i></p>

### Stack

- [x] Expo [SDK53](https://expo.dev/changelog/sdk-53-beta) with the new architecture enabled.
- [x] [Unistyles 3.0](https://www.unistyl.es/v3/start/introduction) as a drop-in replacement for the `StyleSheet` API.
- [x] [React Native Skia](https://shopify.github.io/react-native-skia/) to render 2D and image-based shaders.
- [ ] [Three.js]() together with [React Native WebGPU](https://github.com/wcandillon/react-native-webgpu) and [TypeGPU](https://docs.swmansion.com/TypeGPU/integration/react-native/) to render 3D scenes.

## Features

#### Torus
 Adaptation of [@baconbrix](https://x.com/baconbrix/status/1924919835420504339) torus example using Skia instead of Three.js.

[`./features/Torus/Torus.tsx`](./features/Torus/Torus.tsx)
[`./features/Torus/Torus.sksl`](./features/Torus/Torus.sksl)
