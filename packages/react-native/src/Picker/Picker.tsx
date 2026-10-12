import { useState } from 'react';
import { Picker as NativePicker } from '@react-native-picker/picker';
import { View } from 'react-native';
import type { PickerProps } from '@valencesoftwareio/types';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { Typography } from '../Typography/Typography';

export const Picker = ({
  options,
  value,
  placeholder,
  onChange,
  error,
  disabled,
  helperText,
  label,
}: PickerProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const isDisabled = disabled || !onChange;
  let borderColor = theme.colorBorderControl;

  if (focused) {
    borderColor = theme.colorBorderFocus;
  }

  if (error) {
    borderColor = theme.colorActionDangerText;
  }

  if (isDisabled) {
    borderColor = theme.colorBorderPrimary;
  }

  return (
    <View style={{ gap: 6 }}>
      <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
        {label}
      </Typography>
      <View
        style={{
          minHeight: theme.controlFieldHeight,
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: isDisabled ? theme.colorBackgroundSubtle : theme.colorBackgroundPrimary,
          borderWidth: 1.5,
          borderColor,
          borderRadius: theme.radiusControl,
        }}
      >
        <NativePicker
          selectedValue={value}
          enabled={!isDisabled}
          onValueChange={(nextValue) => onChange?.(String(nextValue))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          accessibilityState={{ disabled: isDisabled }}
          dropdownIconColor={isDisabled ? theme.colorTextMuted : theme.colorTextPrimary}
          itemStyle={{ color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary }}
          style={{
            minHeight: theme.controlFieldHeight,
            color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary,
          }}
        >
          {placeholder && (
            <NativePicker.Item
              label={placeholder}
              value=""
              enabled={false}
              color={theme.colorTextMuted}
            />
          )}
          {options.map((option) => (
            <NativePicker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={isDisabled ? theme.colorTextMuted : theme.colorTextPrimary}
            />
          ))}
        </NativePicker>
      </View>
      {helperText && (
        <Typography
          variant="meta"
          style={{ color: error ? theme.colorActionDangerText : theme.colorTextReadable }}
        >
          {helperText}
        </Typography>
      )}
    </View>
  );
};
