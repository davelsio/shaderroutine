<h1 align="center">Shader Routine</h1>
<p align="center"><i>Isolated experiments with shaders in React Native</i></p>

### Stack

- [x] Expo [SDK53](https://expo.dev/changelog/sdk-53-beta) with the new architecture enabled.
- [x] [Unistyles 3.0](https://www.unistyl.es/v3/start/introduction) as a drop-in replacement for the `StyleSheet` API.
- [x] [React Native Skia](https://shopify.github.io/react-native-skia/) to render 2D and image-based shaders.
- [ ] [Three.js]() together with [React Native WebGPU](https://github.com/wcandillon/react-native-webgpu) and [TypeGPU](https://docs.swmansion.com/TypeGPU/integration/react-native/) to render 3D scenes.

## Features

#### Slider Reveal

[`./features/Reveal/`](./src/features/Reveal/)

A cool SDF-based transition effect built on top of the amazing [Circular Slider](https://www.youtube.com/watch?v=6Va1yBFdUxI&t=47s) component by [Catalin Miron](https://www.youtube.com/@CatalinMironDev/).

https://github.com/user-attachments/assets/0fe436a7-ea85-41ae-a9c1-1ee5aaeacf84

#### Sun

[`./features/Sun/`](./src/features/Sun/)

Skia adaptation of the [main sequence star](https://www.shadertoy.com/view/4dXGR4) shader in [Shadertoy](https://www.shadertoy.com/).

https://github.com/user-attachments/assets/24c7cfaa-baac-486f-a6dc-64f354e6737c

#### Torus

[`./features/Torus/`](./src/features/Torus/)

Adaptation of [@baconbrix](https://x.com/baconbrix/status/1924919835420504339) torus example using Skia instead of Three.js.

https://github.com/user-attachments/assets/b755a2de-0f02-4d15-b0ae-52c4ca5dcd7d
