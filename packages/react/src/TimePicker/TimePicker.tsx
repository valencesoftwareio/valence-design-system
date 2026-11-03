import type { TimePickerProps } from '@valencesoftwareio/types';
import { NumberField } from '@/NumberField';
import { SegmentedControl } from '@/SegmentedControl';
import { Typography } from '@/Typography';
import styles from './TimePicker.module.css';

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
    <div
      className={styles.wrap}
      data-disabled={disabled || undefined}
      data-invalid={error || undefined}
    >
      <Typography variant="label" className={styles.label}>
        {label}
      </Typography>
      <div className={styles.fields}>
        <NumberField
          disabled={disabled}
          error={error}
          label="Hour"
          max={12}
          min={1}
          onChange={(nextHour) => updateValue(nextHour, minutes, period)}
          value={hour}
        />
        <NumberField
          disabled={disabled}
          error={error}
          label="Minute"
          max={59}
          min={0}
          onChange={(nextMinutes) => updateValue(hour, nextMinutes, period)}
          value={minutes}
        />
      </div>
      <SegmentedControl
        disabled={disabled}
        label="Period"
        onChange={(nextPeriod) => updateValue(hour, minutes, nextPeriod)}
        options={PERIOD_OPTIONS}
        value={period}
      />
      {helperText ? (
        <Typography variant="meta" className={error ? styles.error : styles.helper}>
          {helperText}
        </Typography>
      ) : null}
    </div>
  );
};
