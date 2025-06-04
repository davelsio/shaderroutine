import RNSlider, {
  type SliderProps as RNSliderProps,
} from '@react-native-community/slider';
import { View } from 'react-native';

import { Text } from '@typography/Text';

import styles from './Slider.styles';

interface SliderProps extends RNSliderProps {
  label?: string;
}

export function Slider({ label, style, ...props }: SliderProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text variant="headline">{label}</Text>}
      <RNSlider style={styles.slider} tapToSeek {...props} />
    </View>
  );
}
