import { View } from 'react-native';
import type { ProgressBarProps } from '@valencesoftwareio/types';
import { useTheme } from 'ThemeProvider';

export const ProgressBar = ({ value, max = 100, label }: ProgressBarProps) => {
  const theme = useTheme();
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: safeMax, now: current }}
      style={{
        width: '100%',
        height: 4,
        overflow: 'hidden',
        borderRadius: 999,
        backgroundColor: theme.colorBorderDivider,
      }}
    >
      <View
        style={{
          width: `${(current / safeMax) * 100}%`,
          height: '100%',
          borderRadius: 999,
          backgroundColor: theme.colorTextPrimary,
        }}
      />
    </View>
  );
};
