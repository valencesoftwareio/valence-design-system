import { parseTime } from '@internationalized/date';
import { DateInput, DateSegment, Label, Text, TimeField } from 'react-aria-components';
import type { TimeValue } from 'react-aria-components';
import type { TimePickerProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './TimePicker.module.css';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TimePicker = ({
  disabled,
  error,
  helperText,
  label,
  onChange,
  value,
}: TimePickerProps) => {
  if (!TIME_PATTERN.test(value)) {
    throw new RangeError(`TimePicker value must use HH:mm format, got ${value}.`);
  }

  const serializeValue = (time: TimeValue) => {
    return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
  };

  return (
    <TimeField
      className={styles.wrap}
      granularity="minute"
      hourCycle={12}
      isDisabled={disabled || !onChange}
      isInvalid={error}
      onChange={(time) => {
        if (time) {
          onChange?.(serializeValue(time));
        }
      }}
      value={parseTime(value)}
    >
      <Label className={styles.label}>
        <Typography variant="label">{label}</Typography>
      </Label>
      <DateInput
        className={styles.input}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.querySelector<HTMLElement>('[role="spinbutton"]')?.focus();
          }
        }}
      >
        {(segment) => <DateSegment className={styles.segment} segment={segment} />}
      </DateInput>
      {helperText ? (
        <Text className={`${styles.helper} ${error ? styles.helperError : ''}`} slot="description">
          {helperText}
        </Text>
      ) : null}
    </TimeField>
  );
};
