import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  vec,
} from '@shopify/react-native-skia';
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
  WithSpringConfig,
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { CircularSlider } from '@components/CircularSlider';
import { useImages } from '@hooks/useImages';
import { useSkShader } from '@hooks/useShader';
import { fbm } from '@shaders/fbm/fbm.module';
import type { ShaderModule } from '@shaders/modules';
import { sdfCircle } from '@shaders/sdfCircle/sdfCircle.module';
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
  const { rt } = useUnistyles();
  const { error, loading, images } = useImages(imageURIs);

  const { shader } = useSkShader(revealSkShader);

  const currIndex = useSharedValue(0);
  const nextIndex = useSharedValue(1);
  const progress = useSharedValue(0);
  const animating = useSharedValue(false);
  const scrollIndex = useSharedValue(0);

  const uniforms = useDerivedValue(() => ({
    uResolution: vec(rt.screen.width, rt.screen.height),
    uProgress: progress.value,
  }));

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT) // forward
    .onStart(() => {
      if (animating.value) {
        return;
      }

      animating.set(true);
      nextIndex.set(loopForward(currIndex.value, imageURIs.length));
      progress.set(0.0);
      progress.set(
        withSpring(1, flingSpring, (finished) => {
          if (finished) {
            animating.set(false);
            currIndex.set(loopForward(currIndex.value, imageURIs.length));
            nextIndex.set(loopForward(currIndex.value, imageURIs.length));
            progress.set(0.0);
          }
        })
      );

      scrollIndex.set(nextIndex.value);
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT) // backward
    .onStart(() => {
      if (animating.value) {
        return;
      }

      animating.set(true);
      nextIndex.set(currIndex.value);
      currIndex.set(loopBackward(nextIndex.value, imageURIs.length));
      progress.set(1.0);

      progress.set(
        withSpring(0, flingSpring, (finished) => {
          if (finished) {
            animating.set(false);
            nextIndex.set(loopForward(currIndex.value, imageURIs.length));
          }
        })
      );

      scrollIndex.set(currIndex.value);
    });

  const gesture = Gesture.Exclusive(flingLeft, flingRight);

  const onCarouselChange = (_currIndex: number, _prevIndex: number) => {
    'worklet';
    if (_currIndex === _prevIndex) {
      return;
    }

    if (animating.value) {
      return;
    }

    animating.set(true);

    // Inverted directions, for consistency with the fling gesture
    const direction =
      _currIndex > _prevIndex
        ? Directions.LEFT // forward
        : Directions.RIGHT; // backward

    let toValue: number;

    if (direction === Directions.LEFT) {
      toValue = 1.0;
      currIndex.set(_prevIndex);
      nextIndex.set(_currIndex);
      progress.set(0.0);
    } else {
      toValue = 0.0;
      progress.set(1.0);
      currIndex.set(_currIndex);
      nextIndex.set(_prevIndex);
    }

    progress.set(
      withSpring(toValue, scrollSpring, (finished) => {
        if (finished) {
          currIndex.set(_currIndex);
          nextIndex.set(loopForward(_currIndex, imageURIs.length));
          progress.set(0.0);
          animating.set(false);
        }
      })
    );
  };

  const image1 = useDerivedValue(() => {
    return images[currIndex.value] ?? null;
  });

  const image2 = useDerivedValue(() => {
    return images[nextIndex.value] ?? null;
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
          images={imageURIs}
          index={scrollIndex}
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
