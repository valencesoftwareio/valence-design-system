import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { TimePickerProps } from '@valencesoftwareio/types';
import { GEIST } from '@/foundations/fonts';
import { Typography } from '@/Typography';
import { useTheme } from '@/ThemeProvider';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TimePicker = ({
  disabled,
  error,
  helperText,
  hideLabel,
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
  const [focusedSegment, setFocusedSegment] = useState<'hour' | 'minute' | 'period' | null>(null);
  const isDisabled = Boolean(disabled || !onChange);
  const displayedHour = hourInput ?? String(hour);
  const displayedMinute = minuteInput ?? String(minutes).padStart(2, '0');
  const draftHour = Math.min(12, Math.max(1, Number(displayedHour) || hour));
  const draftMinute = Math.min(59, Math.max(0, Number(displayedMinute) || 0));
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
    setFocusedSegment(null);
    setHourInput(null);
    updateValue(draftHour, draftMinute, period);
  };

  const commitMinute = () => {
    setFocusedSegment(null);
    setMinuteInput(null);
    updateValue(draftHour, draftMinute, period);
  };

  return (
    <View style={[styles.wrap, { gap: theme.spacingMd }]}>
      {hideLabel ? null : (
        <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
          {label}
        </Typography>
      )}
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
        <Typography variant="display" style={{ color: theme.colorTextPrimary, marginTop: 14 }}>
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
        <Pressable
          accessibilityLabel={`${period.toUpperCase()}, switch to ${period === 'am' ? 'PM' : 'AM'}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: isDisabled }}
          disabled={isDisabled}
          onBlur={() => setFocusedSegment(null)}
          onFocus={() => setFocusedSegment('period')}
          onPress={() => updateValue(draftHour, draftMinute, period === 'am' ? 'pm' : 'am')}
          style={({ pressed }) => [
            styles.period,
            {
              backgroundColor: pressed ? theme.colorBackgroundSubtle : 'transparent',
              borderRadius: theme.radiusMd,
              outlineColor: theme.colorBorderFocus,
              outlineStyle: 'solid',
              outlineWidth: focusedSegment === 'period' ? 3 : 0,
            },
          ]}
        >
          <Typography
            variant="numeral"
            style={{ color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary }}
          >
            {period.toUpperCase()}
          </Typography>
        </Pressable>
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
    height: 64,
    textAlign: 'center',
    width: 72,
  },
  period: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  segment: {
    alignItems: 'center',
    gap: 4,
  },
  time: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wrap: {
    alignSelf: 'center',
    maxWidth: 320,
  },
});
