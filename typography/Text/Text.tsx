import type { ComponentPropsWithRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { FontFamily } from '@theme/vars/fonts';

import styles, { type TextOptions, type TextVariants } from './Text.styles';

export interface TextProps<Family extends FontFamily>
  extends ComponentPropsWithRef<typeof RNText>,
    RNTextProps,
    TextVariants,
    TextOptions<Family> {}

export function Text<Family extends FontFamily>({
  align,
  face,
  family,
  transform,
  ref,
  size,
  style,
  variant,
  ...props
}: TextProps<Family>) {
  styles.useVariants({
    align,
    transform,
    variant,
  });
  return (
    <RNText
      ref={ref}
      style={[styles.text({ family, face, size }), style]}
      {...props}
    />
  );
}
