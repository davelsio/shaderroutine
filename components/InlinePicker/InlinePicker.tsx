import { View } from 'react-native';
import ReanimatedColorPicker, {
  type ColorPickerProps as ReanimatedColorPickerProps,
} from 'reanimated-color-picker';

import styles from './InlinePicker.styles';

interface ColorPickerProps extends ReanimatedColorPickerProps {}

export function ColorPicker({ children, ...props }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      <ReanimatedColorPicker style={styles.picker} thumbSize={25} {...props}>
        {children}
      </ReanimatedColorPicker>
    </View>
  );
}
