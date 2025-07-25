import {
  type RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ListRenderItem,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { clamp, useSharedValue } from 'react-native-reanimated';

import styles, { ITEM_SIZE, ITEM_SPACING } from './CircularSlider.styles';
import { CircularSliderItem } from './CircularSliderItem';

type CircularSliderProps = {
  images: string[];
  onChange?: (currIndex: number, prevIndex: number) => void;
  onMomentumEnd?: (currIndex: number, prevIndex: number) => void;
  ref?: RefObject<CircularSliderApi | null>;
};

export type CircularSliderApi = {
  scrollToIndex: (props: { index: number; animated?: boolean }) => void;
};

const ITEM_TOTAL_SIZE = ITEM_SIZE + ITEM_SPACING;

export function CircularSlider({
  images,
  onChange,
  onMomentumEnd,
  ref,
}: CircularSliderProps) {
  const sliderRef = useRef<FlatList<string> | null>(null);

  const scrollIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (props: { index: number; animated?: boolean }) => {
      sliderRef.current?.scrollToOffset({
        offset: props.index * ITEM_TOTAL_SIZE,
        animated: true,
      });
    },
  }));

  const onScrollMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      prevIndex.value = activeIndex.value;
      onMomentumEnd?.(activeIndex.value, prevIndex.value);
    },
    [activeIndex, onMomentumEnd, prevIndex]
  );

  const onScroll = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollIndex.value = clamp(
        contentOffset.x / ITEM_TOTAL_SIZE,
        0,
        images.length - 1
      );
      activeIndex.value = Math.round(scrollIndex.value);

      onChange?.(activeIndex.value, prevIndex.value);
    },
    [images, activeIndex, onChange, scrollIndex, prevIndex]
  );

  const renderItem = useCallback<ListRenderItem<string>>(
    ({ item, index }) => (
      <CircularSliderItem
        imageUri={item}
        index={index}
        scrollIndex={scrollIndex}
      />
    ),
    [scrollIndex]
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
