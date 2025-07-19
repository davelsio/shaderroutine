import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { CircularSlider } from '@components/CircularSlider';
import { useImages } from '@hooks/useImages';
import { useShader } from '@hooks/useShader';
import { fbm } from '@shaders/fbm';
import type { ShaderModule } from '@shaders/modules';
import { sdfCircle } from '@shaders/sdfCircle';

import styles from './Reveal.styles';

const revealSkShader: ShaderModule = {
  module: require('./Reveal.glsl'),
  dependencies: [fbm, sdfCircle],
};

export function Reveal() {
  const { rt } = useUnistyles();
  // const clock = useClock();
  const { error, loading, images } = useImages(imageURIs);

  const { shader } = useShader(revealSkShader);

  const skShader = useMemo(
    () => (shader ? Skia.RuntimeEffect.Make(shader) : null),
    [shader]
  );

  const index1 = useSharedValue(0);
  const index2 = useSharedValue(1);
  const progress = useSharedValue(0);
  const animating = useSharedValue(false);

  const uniforms = useDerivedValue(() => ({
    uResolution: vec(rt.screen.width, rt.screen.height),
    // uTime: clock.value / 1000, // convert to seconds
    uProgress: progress.value,
  }));

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT) // forward
    .onStart(() => {
      if (animating.value) {
        return;
      }

      animating.value = true;
      index2.value = loopForward(index1.value);
      progress.value = 0.0;
      progress.value = withSpring(
        1,
        { damping: 50, stiffness: 50 },
        (finished) => {
          if (finished) {
            animating.value = false;
            index1.value = loopForward(index1.value);
            index2.value = loopForward(index1.value + 1);
            progress.value = 0.0;
          }
        }
      );
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT) // backward
    .onStart(() => {
      if (animating.value) {
        return;
      }

      animating.value = true;
      index2.value = index1.value;
      index1.value = loopBackward(index2.value);
      progress.value = 1.0;

      progress.value = withSpring(
        0,
        { damping: 50, stiffness: 50 },
        (finished) => {
          if (finished) {
            animating.value = false;
            index2.value = loopForward(index1.value + 1);
          }
        }
      );
    });

  const gesture = Gesture.Exclusive(flingLeft, flingRight);

  const onCarouselChange = useCallback(
    (currIndex: number, prevIndex: number) => {
      'worklet';
      if (currIndex === prevIndex) {
        return;
      }

      // Inverted directions, for consistency with the fling gesture
      const direction =
        currIndex > prevIndex
          ? Directions.LEFT // forward
          : Directions.RIGHT; // backward

      let toValue: number;

      if (direction === Directions.LEFT) {
        toValue = 1.0;
        index1.value = prevIndex;
        index2.value = currIndex;
        progress.value = 0.0;
      } else {
        toValue = 0.0;
        progress.value = 1.0;
        index1.value = currIndex;
        index2.value = prevIndex;
      }

      progress.value = withSpring(toValue, { damping: 50, stiffness: 50 });
    },
    [index1, index2, progress]
  );

  const image1 = useDerivedValue(() => {
    return images[index1.value] ?? null;
  });

  const image2 = useDerivedValue(() => {
    return images[index2.value] ?? null;
  });

  if (error) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (!skShader) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          <Fill>
            <Shader source={skShader} uniforms={uniforms}>
              <ImageShader
                image={image1}
                fit="cover"
                width={rt.screen.width}
                height={rt.screen.height}
              />
              <ImageShader
                image={image2}
                fit="cover"
                width={rt.screen.width}
                height={rt.screen.height}
              />
            </Shader>
          </Fill>
        </Canvas>
        <CircularSlider images={imageURIs} onMomentumEnd={onCarouselChange} />
      </View>
    </GestureDetector>
  );
}

const imageURIs = [
  'https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=800x800',
  'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=800x800',
  'https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=800x800',
  'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=800x800',
  'https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=800x800',
  'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=800x800',
  'https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=800x800',
];

const loopForward = (index: number) => {
  'worklet';
  return (index + 1) % imageURIs.length;
};

const loopBackward = (index: number) => {
  'worklet';
  return (index - 1 + imageURIs.length) % imageURIs.length;
};
