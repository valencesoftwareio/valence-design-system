import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { TimePickerProps } from '@valencesoftwareio/types';
import { GEIST } from '@/foundations/fonts';
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
  const [hourInput, setHourInput] = useState<string | null>(null);
  const [minuteInput, setMinuteInput] = useState<string | null>(null);
  const [focusedSegment, setFocusedSegment] = useState<'hour' | 'minute' | null>(null);
  const isDisabled = Boolean(disabled || !onChange);
  const displayedHour = hourInput ?? String(hour);
  const displayedMinute = minuteInput ?? String(minutes).padStart(2, '0');
  let hourBorderColor =
    focusedSegment === 'hour' ? theme.colorBorderFocus : theme.colorBorderControl;
  let minuteBorderColor =
    focusedSegment === 'minute' ? theme.colorBorderFocus : theme.colorBorderControl;

  if (error) {
    hourBorderColor = theme.colorActionDangerText;
    minuteBorderColor = theme.colorActionDangerText;
  }

  if (isDisabled) {
    hourBorderColor = theme.colorBorderPrimary;
    minuteBorderColor = theme.colorBorderPrimary;
  }

  const sharedInputStyle = {
    backgroundColor: isDisabled ? theme.colorBackgroundSubtle : theme.colorBackgroundPrimary,
    borderRadius: theme.radiusMd,
    color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary,
    fontSize: theme.typeDisplaySize,
  };
  const hourInputStyle = [
    styles.input,
    {
      ...sharedInputStyle,
      borderColor: hourBorderColor,
    },
  ];
  const minuteInputStyle = [
    styles.input,
    {
      ...sharedInputStyle,
      borderColor: minuteBorderColor,
    },
  ];

  const updateValue = (nextHour: number, nextMinutes: number, nextPeriod: string) => {
    let nextHours = nextHour % 12;

    if (nextPeriod === 'pm') {
      nextHours += 12;
    }

    onChange?.(`${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`);
  };

  const commitHour = () => {
    const nextHour = Math.min(12, Math.max(1, Number(displayedHour) || hour));
    setFocusedSegment(null);
    setHourInput(null);
    updateValue(nextHour, minutes, period);
  };

  const commitMinute = () => {
    const nextMinutes = Math.min(59, Math.max(0, Number(displayedMinute) || 0));
    setFocusedSegment(null);
    setMinuteInput(null);
    updateValue(hour, nextMinutes, period);
  };

  return (
    <View style={[styles.wrap, { gap: theme.spacingMd }]}>
      <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
        {label}
      </Typography>
      <View style={[styles.time, { gap: theme.spacingSm }]}>
        <View style={styles.segment}>
          <TextInput
            accessibilityHint={helperText ? `${error ? 'Invalid. ' : ''}${helperText}` : undefined}
            accessibilityLabel="Hour"
            accessibilityState={{ disabled: isDisabled }}
            editable={!isDisabled}
            keyboardType="number-pad"
            maxLength={2}
            onBlur={commitHour}
            onChangeText={(text) => setHourInput(text.replace(/\D/g, '').slice(0, 2))}
            onFocus={() => setFocusedSegment('hour')}
            selectTextOnFocus
            style={hourInputStyle}
            underlineColorAndroid="transparent"
            value={displayedHour}
          />
          <Typography variant="meta" style={{ color: theme.colorTextSecondary }}>
            Hour
          </Typography>
        </View>
        <Typography variant="display" style={{ color: theme.colorTextPrimary, marginBottom: 21 }}>
          :
        </Typography>
        <View style={styles.segment}>
          <TextInput
            accessibilityHint={helperText ? `${error ? 'Invalid. ' : ''}${helperText}` : undefined}
            accessibilityLabel="Minute"
            accessibilityState={{ disabled: isDisabled }}
            editable={!isDisabled}
            keyboardType="number-pad"
            maxLength={2}
            onBlur={commitMinute}
            onChangeText={(text) => setMinuteInput(text.replace(/\D/g, '').slice(0, 2))}
            onFocus={() => setFocusedSegment('minute')}
            selectTextOnFocus
            style={minuteInputStyle}
            underlineColorAndroid="transparent"
            value={displayedMinute}
          />
          <Typography variant="meta" style={{ color: theme.colorTextSecondary }}>
            Minute
          </Typography>
        </View>
        <View
          accessibilityLabel="Period"
          accessibilityRole="radiogroup"
          style={[
            styles.period,
            {
              borderColor: isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl,
              borderRadius: theme.radiusMd,
            },
          ]}
        >
          {PERIOD_OPTIONS.map((option, index) => {
            const selected = option.value === period;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected, disabled: isDisabled }}
                disabled={isDisabled}
                key={option.value}
                onPress={() => updateValue(hour, minutes, option.value)}
                style={{
                  alignItems: 'center',
                  backgroundColor: selected
                    ? theme.colorBackgroundSubtle
                    : theme.colorBackgroundPrimary,
                  borderColor: isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl,
                  borderTopWidth: index === 0 ? 0 : 1,
                  flex: 1,
                  justifyContent: 'center',
                  minHeight: 44,
                }}
              >
                <Typography
                  variant="controlLabel"
                  style={{ color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary }}
                >
                  {option.label}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>
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

const styles = StyleSheet.create({
  input: {
    ...GEIST.bold,
    borderWidth: 1.5,
    fontVariant: ['tabular-nums'],
    height: 72,
    textAlign: 'center',
    width: 96,
  },
  period: {
    borderWidth: 1.5,
    height: 93,
    overflow: 'hidden',
    width: 52,
  },
  segment: {
    alignItems: 'center',
    gap: 4,
  },
  time: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wrap: {
    maxWidth: 320,
  },
});
