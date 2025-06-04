import { View } from 'react-native';
import { Preview } from 'reanimated-color-picker';

import { Text } from '@typography/Text';

import styles from './InlinePicker.styles';

type PreviewLabelProps = {
  label: string;
  preview?: boolean;
};

export function PreviewLabel({ label, preview = true }: PreviewLabelProps) {
  return (
    <View style={styles.label}>
      <Text variant="headline">{label}</Text>
      {preview && <Preview style={styles.sliderPreview} hideInitialColor />}
    </View>
  );
}
