import RNSlider, {
  type SliderProps as RNSliderProps,
} from '@react-native-community/slider';
import { View } from 'react-native';
import { withUnistyles } from 'react-native-unistyles';

import { Text } from '../../typography/Text';

import styles from './Slider.styles';

interface SliderProps extends RNSliderProps {
  label?: string;
}

const ThemedSlider = withUnistyles(RNSlider, (theme, rt) => ({
  minimumTrackTintColor: theme.colors.grayTextContrast,
  maximumTrackTintColor: theme.colors.grayTextSubtle,
}));

export function Slider({ label, style, ...props }: SliderProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text variant="headline">{label}</Text>}
      <ThemedSlider style={styles.slider} tapToSeek {...props} />
    </View>
  );
}
