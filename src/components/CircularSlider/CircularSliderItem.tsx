import { useMemo } from 'react';
import { Image } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import styles, { ITEM_SIZE } from './CircularSlider.styles';

type CarouselItemProps = {
  imageUri: string;
  index: number;
  scrollIndex: SharedValue<number>;
};

export function CircularSliderItem({
  imageUri,
  index,
  scrollIndex,
}: CarouselItemProps) {
  const source = useMemo(() => ({ uri: imageUri }), [imageUri]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateDown = ITEM_SIZE / 3;
    return {
      borderColor: interpolateColor(
        scrollIndex.value,
        [index - 1, index, index + 1],
        ['transparent', 'white', 'transparent']
      ),
      transform: [
        {
          translateY: interpolate(
            scrollIndex.value,
            [index - 1, index, index + 1],
            [translateDown, 0, translateDown]
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.carouselItem, animatedStyle]}>
      <Image source={source} style={styles.carouselImage} />
    </Animated.View>
  );
}
