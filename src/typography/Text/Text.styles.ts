import { StyleSheet, UnistylesVariants } from 'react-native-unistyles';

import type { ExtractFace, FontFamily } from '../../theme/vars/fonts';

export type TextOptions<Family extends FontFamily> = {
  family?: Family;
  face?: ExtractFace<Family>;
  size?: number;
};

const styleSheet = StyleSheet.create((theme) => ({
  text: <Family extends FontFamily>({
    face,
    family,
    size,
  }: TextOptions<Family>) => ({
    color: theme.colors.grayTextContrast,
    fontSize: size,
    fontFamily: family ? theme.font(family, face ?? 'Regular') : undefined,
    variants: {
      align: {
        center: {
          textAlign: 'center',
        },
        left: {
          textAlign: 'left',
        },
        right: {
          textAlign: 'right',
        },
        justify: {
          textAlign: 'justify',
        },
      },

      transform: {
        capitalize: {
          textTransform: 'capitalize',
        },
        lowercase: {
          textTransform: 'lowercase',
        },
        uppercase: {
          textTransform: 'uppercase',
        },
      },

      /**
       * Spec from Human Interface Guidelines (iOS, iPad -> Large)
       * @see https://developer.apple.com/design/human-interface-guidelines/typography#Specifications
       */
      variant: {
        largeTitle: {
          fontSize: 34,
          fontWeight: face ? undefined : 700,
          lineHeight: 41,
        },
        title1: {
          fontSize: 28,
          fontWeight: face ? undefined : 400,
          lineHeight: 34,
        },
        title2: {
          fontSize: 22,
          fontWeight: face ? undefined : 400,
          lineHeight: 28,
        },
        title3: {
          fontSize: 20,
          fontWeight: face ? undefined : 400,
          lineHeight: 25,
        },
        headline: {
          fontSize: 17,
          fontWeight: face ? undefined : 600,
          lineHeight: 22,
        },
        body: {
          fontSize: 17,
          fontWeight: face ? undefined : 400,
          lineHeight: 22,
        },
        callout: {
          fontSize: 16,
          fontWeight: face ? undefined : 400,
          lineHeight: 21,
        },
        subhead: {
          fontSize: 15,
          fontWeight: face ? undefined : 400,
          lineHeight: 20,
        },
        footnote: {
          fontSize: 13,
          fontWeight: face ? undefined : 400,
          lineHeight: 18,
        },
        caption1: {
          fontSize: 12,
          fontWeight: face ? undefined : 400,
          lineHeight: 16,
        },
        caption2: {
          fontSize: 11,
          fontWeight: face ? undefined : 400,
          lineHeight: 13,
        },
      },
    },
  }),
}));

export type TextVariants = UnistylesVariants<typeof styleSheet>;

export default styleSheet;
