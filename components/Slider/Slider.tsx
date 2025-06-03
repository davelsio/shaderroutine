import CommunitySlider, {
  SliderProps as CommunitySliderProps,
} from '@react-native-community/slider';
import { useCallback } from 'react';
import { View } from 'react-native';

import { Text } from '@typography/Text';

import styles from './Slider.styles';

interface SliderProps
  extends Omit<
    CommunitySliderProps,
    'onSlidingComplete' | 'onSlidingStart' | 'onValueChange'
  > {
  onValueChange: (value: number, finished: boolean) => void;
}

export function Slider({ value, onValueChange, ...props }: SliderProps) {
  const onUpdate = useCallback(
    (value: number) => {
      'worklet';
      onValueChange(value, false);
    },
    [onValueChange]
  );

  const onComplete = useCallback(
    (value: number) => {
      'worklet';
      onValueChange(value, true);
    },
    [onValueChange]
  );

  return (
    <View style={styles.container}>
      <Text variant="headline">Radius</Text>
      <CommunitySlider
        // Styles
        style={styles.slider}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#FFFFFF60"
        // Behavior
        lowerLimit={0.1}
        minimumValue={0}
        maximumValue={1}
        tapToSeek
        // Data
        value={value}
        onValueChange={onUpdate}
        onSlidingComplete={onComplete}
        {...props}
      />
    </View>
  );
}
