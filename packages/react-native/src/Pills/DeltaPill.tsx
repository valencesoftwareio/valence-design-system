import { View } from 'react-native';
import type { DeltaPillProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { alpha } from '#src/color/colorMix';
import { Typography } from '#src/Typography/Typography';

export const DeltaPill = ({ value, unit = '' }: DeltaPillProps) => {
  const theme = useTheme();
  const valid = Number.isFinite(value);
  let background: string;
  let foreground: string;

  if (valid && value > 0) {
    background = alpha(theme.colorStatePositive, 0.16);
    foreground = theme.colorTextPrimary;
  } else if (valid && value < 0) {
    background = alpha(theme.colorStateRed, 0.14);
    foreground = theme.colorTextPrimary;
  } else {
    background = alpha(theme.colorTextPrimary, 0.1);
    foreground = theme.colorTextPrimary;
  }

  return (
    <View
      style={{
        paddingVertical: theme.spacingXs,
        paddingHorizontal: 10,
        borderRadius: theme.radiusPill,
        backgroundColor: background,
        alignSelf: 'flex-start',
      }}
    >
      <Typography variant="badge" style={{ color: foreground }}>
        {valid && value > 0 ? '+' : ''}
        {valid ? value : '—'}
        {unit}
      </Typography>
    </View>
  );
};
