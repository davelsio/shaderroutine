This example is a Skia adaptation of the [main sequence star](https://www.shadertoy.com/view/4dXGR4) shader in [Shadertoy](https://www.shadertoy.com/).

Besides the Skia-specific changes, I've made several modifications to the original shader to make it more interactive and easier to understand:

- [x] Unified the fragment position and made it relative to the sphere radius, so all sun components scale and translate together.
- [x] Removed the brightness diffuse in favor of a single control variable.
- [x] Rewrote various functions to have a more controlled behavior and component decomposition.
- [x] Added uniforms to control colors, brightness, radius, and various corona effects.

I started wanting to learn how to create a 3D-looking structure from just a UV input, so I could reimplement it using Skia. Then I noticed several inconsistencies in the texture sampling and sun component transformations when trying to modify the scale or offset the position of the spheres, so I went ahead and fixed those too.

Overall, it got sufficient changes to say I kind of made it my own, but it still significantly reuses much of the original logic, including the value noise function for the corona effect or the texture sampling approach. I added a simple presets and tweaks UI on top to make it feel more interactive, and then added some haptics to the mix. Nothing too fancy, and I obviously need to work on my taste, but it's a start.
