import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  vec,
} from '@shopify/react-native-skia';
import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { CircularSlider, CircularSliderApi } from '@components/CircularSlider';
import { useImages } from '@hooks/useImages';
import { useSkShader } from '@hooks/useSkShader';
import { fbm } from '@shaders/fbm';
import type { ShaderModule } from '@shaders/modules';
import { sdfCircle } from '@shaders/sdfCircle';
import { loopBackward, loopForward } from '@utils/loopValue';

import styles from './Reveal.styles';

const revealSkShader: ShaderModule = {
  module: require('./Reveal.glsl'),
  dependencies: [fbm, sdfCircle],
};

const flingSpring: WithSpringConfig = {
  mass: 1,
  damping: 26,
  stiffness: 100,
  velocity: 0,
};

const scrollSpring: WithSpringConfig = {
  mass: 1,
  damping: 26,
  stiffness: 170,
  velocity: 0,
};

export function Reveal() {
  const sliderRef = useRef<CircularSliderApi>(null);

  const { rt } = useUnistyles();
  const { error, loading, images } = useImages(imageURIs);

  const { shader } = useSkShader(revealSkShader);

  const index1 = useSharedValue(0);
  const index2 = useSharedValue(1);
  const progress = useSharedValue(0);
  const animating = useSharedValue(false);

  const uniforms = useDerivedValue(() => ({
    uResolution: vec(rt.screen.width, rt.screen.height),
    uProgress: progress.value,
  }));

  const scrollToIndex = useCallback(
    (index: number) => {
      sliderRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    },
    [sliderRef]
  );

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT) // forward
    .onStart(() => {
      if (animating.value) {
        return;
      }

      animating.value = true;
      index2.value = loopForward(index1.value, imageURIs.length);
      progress.value = 0.0;
      progress.value = withSpring(1, flingSpring, (finished) => {
        if (finished) {
          animating.value = false;
          index1.value = loopForward(index1.value, imageURIs.length);
          index2.value = loopForward(index1.value, imageURIs.length);
          progress.value = 0.0;
        }
      });

      runOnJS(scrollToIndex)(index2.value);
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT) // backward
    .onStart(() => {
      if (animating.value) {
        return;
      }

      animating.value = true;
      index2.value = index1.value;
      index1.value = loopBackward(index2.value, imageURIs.length);
      progress.value = 1.0;

      progress.value = withSpring(0, flingSpring, (finished) => {
        if (finished) {
          animating.value = false;
          index2.value = loopForward(index1.value, imageURIs.length);
        }
      });

      runOnJS(scrollToIndex)(index1.value);
    });

  const gesture = Gesture.Exclusive(flingLeft, flingRight);

  const onCarouselChange = useCallback(
    (currIndex: number, prevIndex: number) => {
      'worklet';
      if (currIndex === prevIndex) {
        return;
      }

      if (animating.value) {
        return;
      }

      animating.value = true;

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

      progress.value = withSpring(toValue, scrollSpring, (finished) => {
        if (finished) {
          index1.value = currIndex;
          index2.value = loopForward(currIndex, imageURIs.length);
          progress.value = 0.0;
          animating.value = false;
        }
      });
    },
    [animating, index1, index2, progress]
  );

  const image1 = useDerivedValue(() => {
    return images[index1.value] ?? null;
  });

  const image2 = useDerivedValue(() => {
    return images[index2.value] ?? null;
  });

  if (error) return null;
  if (loading) return null;
  if (!shader) return null;

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          <Fill>
            <Shader source={shader} uniforms={uniforms}>
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
        <CircularSlider
          ref={sliderRef}
          images={imageURIs}
          onMomentumEnd={onCarouselChange}
        />
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
