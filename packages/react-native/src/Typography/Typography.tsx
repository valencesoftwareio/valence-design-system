import { Text, type TextProps, type TextStyle } from 'react-native';
import type { Theme } from '@valencesoftwareio/tokens';
import type {
  TypographyProps as SharedTypographyProps,
  TypographyVariant,
} from '@valencesoftwareio/types';
import { useTheme } from 'ThemeProvider';
import { GEIST } from 'foundations/fonts';

export interface TypographyProps extends SharedTypographyProps, Omit<TextProps, 'children'> {}

const HEADER_VARIANTS = new Set<TypographyVariant>(['display', 'title', 'titleSm']);

const weightStyle = (weight: number): Pick<TextStyle, 'fontFamily' | 'fontWeight'> => {
  if (weight >= 700) {
    return GEIST.bold;
  }

  if (weight >= 600) {
    return GEIST.semibold;
  }

  return GEIST.regular;
};

const variantStyle = (variant: TypographyVariant, theme: Theme): TextStyle => {
  switch (variant) {
    case 'display':
      return {
        fontSize: theme.typeDisplaySize,
        letterSpacing: theme.typeDisplaySize * theme.typeDisplayTracking,
        ...weightStyle(theme.typeDisplayWeight),
      };
    case 'title':
      return {
        fontSize: theme.typeTitleSize,
        letterSpacing: theme.typeTitleSize * theme.typeTitleTracking,
        ...weightStyle(theme.typeTitleWeight),
      };
    case 'titleSm':
      return {
        fontSize: theme.typeTitleSmSize,
        letterSpacing: theme.typeTitleSmSize * theme.typeTitleSmTracking,
        ...weightStyle(theme.typeTitleSmWeight),
      };
    case 'body':
      return {
        fontSize: theme.typeBodySize,
        letterSpacing: theme.typeBodySize * theme.typeBodyTracking,
        ...weightStyle(theme.typeBodyWeight),
      };
    case 'bodyLg':
      return {
        fontSize: theme.typeBodyLgSize,
        letterSpacing: theme.typeBodyLgSize * theme.typeBodyLgTracking,
        ...weightStyle(theme.typeBodyLgWeight),
      };
    case 'meta':
      return {
        fontSize: theme.typeMetaSize,
        letterSpacing: theme.typeMetaSize * theme.typeMetaTracking,
        ...weightStyle(theme.typeMetaWeight),
      };
    case 'eyebrow':
      return {
        fontSize: theme.typeEyebrowSize,
        letterSpacing: theme.typeEyebrowSize * theme.typeEyebrowTracking,
        textTransform: 'uppercase',
        ...weightStyle(theme.typeEyebrowWeight),
      };
    case 'numeral':
      return {
        fontSize: theme.typeNumeralSize,
        letterSpacing: theme.typeNumeralSize * theme.typeNumeralTracking,
        fontVariant: ['tabular-nums'],
        ...weightStyle(theme.typeNumeralWeight),
      };
    case 'label':
      return {
        fontSize: theme.typeLabelSize,
        letterSpacing: theme.typeLabelSize * theme.typeLabelTracking,
        ...weightStyle(theme.typeLabelWeight),
      };
    case 'badge':
      return {
        fontSize: theme.typeBadgeSize,
        letterSpacing: theme.typeBadgeSize * theme.typeBadgeTracking,
        ...weightStyle(theme.typeBadgeWeight),
      };
    case 'controlLabel':
      return {
        fontSize: theme.typeControlLabelSize,
        letterSpacing: theme.typeControlLabelSize * theme.typeControlLabelTracking,
        ...weightStyle(theme.typeControlLabelWeight),
      };
  }
};

export const Typography = ({
  variant,
  children,
  style,
  accessibilityRole,
  ...rest
}: TypographyProps) => {
  const theme = useTheme();

  return (
    <Text
      accessibilityRole={accessibilityRole ?? (HEADER_VARIANTS.has(variant) ? 'header' : undefined)}
      style={[{ color: theme.colorTextPrimary }, variantStyle(variant, theme), style]}
      {...rest}
    >
      {children}
    </Text>
  );
};
