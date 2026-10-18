import { useState } from 'react';
import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  Text,
} from 'react-aria-components';
import type { DatePickerProps, DatePickerValue } from '@valencesoftwareio/types';
import { CalendarIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { Typography } from '../Typography/Typography';
import styles from './DatePicker.module.css';

const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isDatePickerValue = (value: string): value is DatePickerValue => {
  return DATE_VALUE_PATTERN.test(value);
};

const toDatePickerValue = (date: DateValue): DatePickerValue => {
  const value = date.toString();

  if (!isDatePickerValue(value)) {
    throw new RangeError(`Unsupported date value: ${value}`);
  }

  return value;
};

export const DatePicker = ({
  value,
  onChange,
  min,
  max,
  required,
  error,
  disabled,
  helperText,
  label,
}: DatePickerProps) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const isDisabled = Boolean(disabled || !onChange);
  const canClear = Boolean(value && onChange && !required && !disabled);

  const openCalendar = () => {
    if (!isDisabled) {
      setOpen(true);
    }
  };

  return (
    <AriaDatePicker
      ref={setPortalContainer}
      className={styles.wrap}
      value={value ? parseDate(value) : null}
      minValue={min ? parseDate(min) : undefined}
      maxValue={max ? parseDate(max) : undefined}
      isDisabled={isDisabled}
      isRequired={required}
      isInvalid={error}
      isOpen={open}
      onOpenChange={setOpen}
      onChange={(date) => onChange?.(date ? toDatePickerValue(date) : null)}
    >
      <Label className={styles.label}>
        <Typography variant="label">
          {label}
          {required ? ' *' : ''}
        </Typography>
      </Label>
      <div className={styles.controlRow}>
        <Group className={styles.group} onClickCapture={openCalendar}>
          <DateInput className={styles.input}>
            {(segment) => <DateSegment className={styles.segment} segment={segment} />}
          </DateInput>
          <Button className={styles.trigger} aria-label={`Open ${label} calendar`}>
            <CalendarIcon aria-hidden size={18} strokeWidth={1.6} absoluteStrokeWidth />
          </Button>
        </Group>
        {canClear && (
          <button
            type="button"
            className={styles.clear}
            aria-label={`Clear ${label}`}
            onClick={() => onChange?.(null)}
          >
            <XIcon aria-hidden size={16} strokeWidth={1.6} absoluteStrokeWidth />
          </button>
        )}
      </div>
      {helperText && (
        <Text slot="description" className={`${styles.helper} ${error ? styles.helperError : ''}`}>
          {helperText}
        </Text>
      )}
      <Popover
        className={styles.popover}
        placement="bottom start"
        UNSTABLE_portalContainer={portalContainer ?? undefined}
      >
        <Dialog className={styles.dialog}>
          <Calendar>
            <header className={styles.calendarHeader}>
              <Button slot="previous" className={styles.navigation} aria-label="Previous month">
                <ChevronRightIcon aria-hidden size={16} strokeWidth={1.6} absoluteStrokeWidth />
              </Button>
              <Heading className={styles.heading} />
              <Button
                slot="next"
                className={`${styles.navigation} ${styles.next}`}
                aria-label="Next month"
              >
                <ChevronRightIcon aria-hidden size={16} strokeWidth={1.6} absoluteStrokeWidth />
              </Button>
            </header>
            <CalendarGrid className={styles.grid}>
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell className={styles.weekday}>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell className={styles.cell} date={date} />}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
};
