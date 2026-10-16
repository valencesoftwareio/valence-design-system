import { useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import type { CalendarProps, DateData } from 'react-native-calendars';
import { Modal, Pressable, View } from 'react-native';
import type { DatePickerProps, DatePickerValue } from '@valencesoftwareio/types';
import { Button } from '../Button/Button';
import { CalendarIcon, XIcon } from '../icons';
import { GEIST } from '../foundations/fonts';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { Typography } from '../Typography/Typography';

const DATE_VALUE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

type CalendarTheme = NonNullable<CalendarProps['theme']>;
type MarkedDates = NonNullable<CalendarProps['markedDates']>;

interface CalendarStyleOverrides {
  'stylesheet.day.basic': {
    base: object;
    selected: object;
    today: object;
    text: object;
  };
}

const isDatePickerValue = (value: string): value is DatePickerValue => {
  return DATE_VALUE_PATTERN.test(value);
};

const parseValue = (value: DatePickerValue): Date => {
  const match = DATE_VALUE_PATTERN.exec(value);

  if (!match) {
    throw new RangeError(`Unsupported date value: ${value}`);
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);

  if (
    date.getFullYear() !== Number(match[1]) ||
    date.getMonth() !== Number(match[2]) - 1 ||
    date.getDate() !== Number(match[3])
  ) {
    throw new RangeError(`Unsupported date value: ${value}`);
  }

  return date;
};

const serializeValue = (date: Date): DatePickerValue => {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const value = `${year}-${month}-${day}`;

  if (!isDatePickerValue(value)) {
    throw new RangeError(`Unsupported date value: ${value}`);
  }

  return value;
};

const initialValue = (
  value: DatePickerValue | null,
  min?: DatePickerValue,
  max?: DatePickerValue,
) => {
  let date = value ? parseValue(value) : new Date();

  if (min && date < parseValue(min)) {
    date = parseValue(min);
  }

  if (max && date > parseValue(max)) {
    date = parseValue(max);
  }

  return serializeValue(date);
};

const formatValue = (value: DatePickerValue) => {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parseValue(value));
};

const toDatePickerValue = (date: DateData): DatePickerValue => {
  if (!isDatePickerValue(date.dateString)) {
    throw new RangeError(`Unsupported date value: ${date.dateString}`);
  }

  return date.dateString;
};

const getMarkedDates = (value: DatePickerValue): MarkedDates => {
  return {
    [value]: {
      selected: true,
      accessibilityLabel: `${formatValue(value)}, selected`,
    },
  };
};

const configureCalendarLocale = () => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const longMonth = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' });
  const shortMonth = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' });
  const longDay = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  const shortDay = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  const months = Array.from({ length: 12 }, (_, month) => new Date(Date.UTC(2020, month, 1)));
  const days = Array.from({ length: 7 }, (_, day) => new Date(Date.UTC(2020, 0, 5 + day)));

  LocaleConfig.locales[locale] = {
    monthNames: months.map((date) => longMonth.format(date)),
    monthNamesShort: months.map((date) => shortMonth.format(date)),
    dayNames: days.map((date) => longDay.format(date)),
    dayNamesShort: days.map((date) => shortDay.format(date)),
  };

  LocaleConfig.defaultLocale = locale;
};

configureCalendarLocale();

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
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [draftValue, setDraftValue] = useState(() => initialValue(value, min, max));
  const isDisabled = Boolean(disabled || !onChange);
  const canClear = Boolean(value && onChange && !required && !disabled);
  const displayedValue = value ? formatValue(value) : 'Select date';
  const accessibilityHint = error ? `Invalid. ${helperText ?? ''}`.trim() : helperText;
  let borderColor = theme.colorBorderControl;

  if (focused || open) {
    borderColor = theme.colorBorderFocus;
  }

  if (error) {
    borderColor = theme.colorActionDangerText;
  }

  if (isDisabled) {
    borderColor = theme.colorBorderPrimary;
  }

  const calendarTheme: CalendarTheme & CalendarStyleOverrides = {
    calendarBackground: theme.colorBackgroundRaised,
    backgroundColor: theme.colorBackgroundRaised,
    monthTextColor: theme.colorTextPrimary,
    dayTextColor: theme.colorTextPrimary,
    textSectionTitleColor: theme.colorTextSecondary,
    textDisabledColor: theme.colorTextMuted,
    textInactiveColor: theme.colorTextMuted,
    todayTextColor: theme.colorTextPrimary,
    selectedDayBackgroundColor: theme.colorTextPrimary,
    selectedDayTextColor: theme.colorBackgroundPrimary,
    arrowColor: theme.colorTextPrimary,
    disabledArrowColor: theme.colorTextMuted,
    textDayFontFamily: GEIST.regular.fontFamily,
    textMonthFontFamily: GEIST.semibold.fontFamily,
    textDayHeaderFontFamily: GEIST.semibold.fontFamily,
    textDayFontSize: theme.typeBodySize,
    textMonthFontSize: theme.typeBodyLgSize,
    textDayHeaderFontSize: theme.typeMetaSize,
    'stylesheet.day.basic': {
      base: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      },
      selected: {
        backgroundColor: theme.colorTextPrimary,
        borderRadius: 22,
      },
      today: {
        borderWidth: 1,
        borderColor: theme.colorBorderControl,
        borderRadius: 22,
      },
      text: {
        marginTop: 0,
        color: theme.colorTextPrimary,
        fontFamily: GEIST.regular.fontFamily,
        fontSize: theme.typeBodySize,
      },
    },
  };

  const openPicker = () => {
    setDraftValue(initialValue(value, min, max));
    setOpen(true);
  };

  const selectDate = (date: DateData) => {
    setDraftValue(toDatePickerValue(date));
  };

  const commitDate = () => {
    onChange?.(draftValue);
    setOpen(false);
  };

  return (
    <View style={{ gap: 6 }}>
      <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
        {label}
        {required ? ' *' : ''}
      </Typography>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Pressable
          disabled={isDisabled}
          onPress={openPicker}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
          accessibilityValue={{ text: displayedValue }}
          accessibilityState={{ disabled: isDisabled }}
          style={{
            minHeight: theme.controlFieldHeight,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacingMd,
            backgroundColor: isDisabled
              ? theme.colorBackgroundSubtle
              : theme.colorBackgroundPrimary,
            borderWidth: 1.5,
            borderColor,
            borderRadius: theme.radiusControl,
          }}
        >
          <Typography
            variant="bodyLg"
            style={{ color: value && !isDisabled ? theme.colorTextPrimary : theme.colorTextMuted }}
          >
            {displayedValue}
          </Typography>
          <CalendarIcon
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            size={18}
            color={isDisabled ? theme.colorTextMuted : theme.colorTextPrimary}
            strokeWidth={1.6}
            absoluteStrokeWidth
          />
        </Pressable>
        {canClear && (
          <Pressable
            onPress={() => onChange?.(null)}
            accessibilityRole="button"
            accessibilityLabel={`Clear ${label}`}
            style={{
              width: theme.controlMinimumTarget,
              height: theme.controlMinimumTarget,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: theme.radiusControl,
            }}
          >
            <XIcon
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              size={16}
              color={theme.colorTextSecondary}
              strokeWidth={1.6}
              absoluteStrokeWidth
            />
          </Pressable>
        )}
      </View>
      {helperText && (
        <Typography
          variant="meta"
          style={{ color: error ? theme.colorActionDangerText : theme.colorTextReadable }}
        >
          {helperText}
        </Typography>
      )}
      {open && (
        <Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable
            accessible={false}
            onPress={() => setOpen(false)}
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: theme.spacingLg,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
            }}
          >
            <Pressable
              accessible={false}
              accessibilityViewIsModal
              onPress={(event) => event.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 440,
                alignSelf: 'center',
                padding: theme.spacingLg,
                gap: theme.spacingMd,
                backgroundColor: theme.colorBackgroundRaised,
                borderWidth: 1,
                borderColor: theme.colorBorderPrimary,
                borderRadius: theme.radiusControl,
                elevation: 12,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.18,
                shadowRadius: 20,
              }}
            >
              <Typography variant="titleSm">{label}</Typography>
              <Calendar
                current={draftValue}
                minDate={min}
                maxDate={max}
                markedDates={getMarkedDates(draftValue)}
                theme={calendarTheme}
                enableSwipeMonths
                onDayPress={selectDate}
                style={{ backgroundColor: theme.colorBackgroundRaised }}
              />
              <View
                style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: theme.spacingSm }}
              >
                <Button kind="ghost" onPress={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onPress={commitDate}>Done</Button>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};
