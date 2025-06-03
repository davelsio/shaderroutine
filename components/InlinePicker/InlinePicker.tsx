import { View } from 'react-native';
import ColorPicker, {
  type ColorFormatsObject,
  Preview,
} from 'reanimated-color-picker';
import { type PropsWithChildren, useCallback } from 'react';

import { Text } from '@typography/Text';

import styles from './InlinePicker.styles';

type InlinePickerProps = {
  label: string;
  value: string;
  onUpdate: (color: ColorFormatsObject, finished: boolean) => void;
  preview?: boolean;
};

export function InlinePicker({
  children,
  label,
  onUpdate,
  preview = true,
  value,
}: PropsWithChildren<InlinePickerProps>) {
  const updateValue = useCallback(
    (colors: ColorFormatsObject) => {
      'worklet';
      onUpdate(colors, false);
    },
    [onUpdate]
  );

  const refreshValue = useCallback(
    (color: ColorFormatsObject) => {
      'worklet';
      onUpdate(color, true);
    },
    [onUpdate]
  );

  return (
    <View style={styles.container}>
      <ColorPicker
        style={styles.picker}
        thumbSize={25}
        value={value}
        onChange={updateValue}
        onComplete={refreshValue}
      >
        <View style={styles.label}>
          <Text variant="headline">{label}</Text>
          {preview && <Preview style={styles.sliderPreview} hideInitialColor />}
        </View>
        {children}
      </ColorPicker>
    </View>
  );
}
