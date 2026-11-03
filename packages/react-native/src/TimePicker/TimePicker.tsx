import type { TimePickerProps } from '@valencesoftwareio/types';
import { View } from 'react-native';
import { NumberField } from '@/NumberField';
import { SegmentedControl } from '@/SegmentedControl';
import { Typography } from '@/Typography';
import { useTheme } from '@/ThemeProvider';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const PERIOD_OPTIONS = [
  { label: 'AM', value: 'am' },
  { label: 'PM', value: 'pm' },
];

export const TimePicker = ({
  disabled,
  error,
  helperText,
  label,
  onChange,
  value,
}: TimePickerProps) => {
  const theme = useTheme();
  const match = TIME_PATTERN.exec(value);

  if (!match) {
    throw new RangeError(`TimePicker value must use HH:mm format, got ${value}.`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = hours >= 12 ? 'pm' : 'am';
  const hour = hours % 12 || 12;

  const updateValue = (nextHour: number, nextMinutes: number, nextPeriod: string) => {
    let nextHours = nextHour % 12;

    if (nextPeriod === 'pm') {
      nextHours += 12;
    }

    const nextValue = `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
    onChange?.(nextValue);
  };

  return (
    <View style={{ gap: theme.spacingSm }}>
      <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
        {label}
      </Typography>
      <View style={{ flexDirection: 'row', gap: theme.spacingSm }}>
        <View style={{ flex: 1 }}>
          <NumberField
            disabled={disabled}
            error={error}
            label="Hour"
            max={12}
            min={1}
            onChange={(nextHour) => updateValue(nextHour, minutes, period)}
            value={hour}
          />
        </View>
        <View style={{ flex: 1 }}>
          <NumberField
            disabled={disabled}
            error={error}
            label="Minute"
            max={59}
            min={0}
            onChange={(nextMinutes) => updateValue(hour, nextMinutes, period)}
            value={minutes}
          />
        </View>
      </View>
      <SegmentedControl
        disabled={disabled}
        label="Period"
        onChange={(nextPeriod) => updateValue(hour, minutes, nextPeriod)}
        options={PERIOD_OPTIONS}
        value={period}
      />
      {helperText ? (
        <Typography
          variant="meta"
          style={{ color: error ? theme.colorActionDangerText : theme.colorTextReadable }}
        >
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
};
