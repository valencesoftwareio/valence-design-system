import { useState } from 'react';
import { TextInput, View } from 'react-native';
import type { TextAreaProps } from '@valencesoftwareio/types';
import { GEIST } from '#src/foundations/fonts';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { Typography } from '#src/Typography/Typography';

export const TextArea = ({
  value,
  placeholder,
  onChangeText,
  maxLength,
  rows = 4,
  required,
  error,
  disabled,
  helperText,
  label,
}: TextAreaProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  let borderColor = focused ? theme.colorBorderFocus : theme.colorBorderControl;

  if (error) {
    borderColor = theme.colorActionDangerText;
  }

  if (disabled) {
    borderColor = theme.colorBorderPrimary;
  }

  return (
    <View style={{ gap: 6, width: '100%' }}>
      <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
        {label}
        {required ? ' *' : ''}
      </Typography>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colorTextSecondary}
        editable={!disabled && Boolean(onChangeText)}
        multiline
        maxLength={maxLength}
        numberOfLines={Math.max(2, rows)}
        textAlignVertical="top"
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={error ? `Invalid. ${helperText ?? ''}`.trim() : helperText}
        accessibilityState={{ disabled: Boolean(disabled) }}
        style={{
          minHeight: Math.max(96, rows * 24),
          padding: theme.spacingMd,
          borderWidth: 1.5,
          borderColor,
          borderRadius: theme.radiusControl,
          backgroundColor: disabled ? theme.colorBackgroundSubtle : theme.colorBackgroundPrimary,
          color: disabled ? theme.colorTextMuted : theme.colorTextPrimary,
          fontSize: theme.typeBodySize,
          ...GEIST.regular,
        }}
      />
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
