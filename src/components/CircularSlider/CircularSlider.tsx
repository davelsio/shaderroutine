import { useRef } from 'react';
import type {
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  clamp,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { CircularSliderItem } from './CircularSliderItem';

import styles, { ITEM_SIZE, ITEM_SPACING } from './CircularSlider.styles';

type CircularSliderProps = {
  images: string[];
  index?: SharedValue<number>;
  onChange?: (currIndex: number, prevIndex: number) => void;
  onMomentumEnd?: (currIndex: number, prevIndex: number) => void;
};

const ITEM_TOTAL_SIZE = ITEM_SIZE + ITEM_SPACING;

export function CircularSlider({
  images,
  index,
  onChange,
  onMomentumEnd,
}: CircularSliderProps) {
  const sliderRef = useRef<FlatList<string> | null>(null);

  const scrollIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  const scrollToIndex = (index: number) => {
    sliderRef.current?.scrollToOffset({
      offset: index * ITEM_TOTAL_SIZE,
      animated: true,
    });
  };

  useAnimatedReaction(
    () => index?.get() ?? null,
    (val) => {
      if (val === null) {
        return;
      }

      scheduleOnRN(scrollToIndex, val);
    }
  );

  const onScrollMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    prevIndex.set(activeIndex.value);
    onMomentumEnd?.(activeIndex.value, prevIndex.value);
  };

  const onScroll = ({
    nativeEvent: { contentOffset },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollIndex.set(
      clamp(contentOffset.x / ITEM_TOTAL_SIZE, 0, images.length - 1)
    );
    activeIndex.set(Math.round(scrollIndex.value));

    onChange?.(activeIndex.value, prevIndex.value);
  };

  const renderItem: ListRenderItem<string> = ({ item, index }) => (
    <CircularSliderItem
      imageUri={item}
      index={index}
      scrollIndex={scrollIndex}
    />
  );

  return (
    <FlatList
      ref={sliderRef}
      style={styles.carousel}
      contentContainerStyle={styles.carouselContainer}
      showsHorizontalScrollIndicator={false}
      // Data
      data={images}
      keyExtractor={(_, index) => String(index)}
      renderItem={renderItem}
      // Behavior
      horizontal
      scrollEventThrottle={1000 / 60} // ~16ms
      snapToInterval={ITEM_TOTAL_SIZE}
      decelerationRate="fast"
      // Events
      onScroll={onScroll}
      onMomentumScrollEnd={onScrollMomentumEnd}
    />
  );
}
