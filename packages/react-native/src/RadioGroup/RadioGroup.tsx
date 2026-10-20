import { View } from 'react-native';
import type { RadioGroupProps } from '@valencesoftwareio/types';
import { Radio } from '@/Radio';
import { Typography } from '@/Typography';
import { useTheme } from '@/ThemeProvider';

export const RadioGroup = ({ options, value, onChange, disabled, label }: RadioGroupProps) => {
  const theme = useTheme();

  return (
    <View style={{ gap: 6 }}>
      <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
        {label}
      </Typography>
      <View accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            label={opt.label}
            checked={opt.value === value}
            disabled={disabled || !onChange}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </View>
    </View>
  );
};
