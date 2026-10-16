import { useEffect, useRef, useState, type Ref } from 'react';
import { AccessibilityInfo, TextInput, View } from 'react-native';
import type { TextFieldProps } from '@valencesoftwareio/types';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { GEIST } from '../foundations/fonts';
import { SearchIcon } from '../icons';
import { Typography } from '../Typography/Typography';

type TextFieldComponentProps = TextFieldProps & { ref?: Ref<TextInput> };

export const TextField = ({
  variant = 'default',
  value,
  placeholder,
  onChangeText,
  onSubmit,
  inputMode,
  autoComplete,
  secureTextEntry,
  maxLength,
  error,
  disabled,
  helperText,
  label,
  ref,
}: TextFieldComponentProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const wasInvalid = useRef(false);
  const isSearch = variant === 'search';

  useEffect(() => {
    if (error && !wasInvalid.current) {
      AccessibilityInfo.announceForAccessibility(`${label} is invalid`);
    }

    wasInvalid.current = Boolean(error);
  }, [error, label]);

  let borderColor = isSearch ? 'transparent' : theme.colorBorderControl;
  let backgroundColor = isSearch ? theme.colorBackgroundRaised : theme.colorBackgroundPrimary;

  if (focused) {
    borderColor = theme.colorBorderFocus;
  }

  if (error) {
    borderColor = theme.colorActionDangerText;
  }

  if (disabled) {
    backgroundColor = theme.colorBackgroundSubtle;
    borderColor = theme.colorBorderPrimary;
  }

  return (
    <View style={{ gap: 6 }}>
      {!isSearch && (
        <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
          {label}
        </Typography>
      )}
      <View
        style={{
          backgroundColor,
          borderRadius: theme.radiusControl,
          paddingHorizontal: theme.spacingMd,
          minHeight: theme.controlFieldHeight,
          borderWidth: 1.5,
          borderColor,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacingSm,
          boxShadow: isSearch && !disabled ? theme.shadowSurface : undefined,
        }}
      >
        {isSearch && (
          <SearchIcon
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            size={16}
            color={theme.colorTextMuted}
            strokeWidth={1.6}
            absoluteStrokeWidth
          />
        )}
        <TextInput
          ref={ref}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={isSearch ? theme.colorTextMuted : theme.colorTextSecondary}
          editable={!disabled && Boolean(onChangeText)}
          inputMode={inputMode}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          returnKeyType={isSearch ? 'search' : undefined}
          onSubmitEditing={onSubmit}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={error ? `Invalid. ${helperText ?? ''}`.trim() : helperText}
          accessibilityState={{ disabled: Boolean(disabled) }}
          style={{
            flex: 1,
            alignSelf: 'stretch',
            paddingVertical: 14,
            fontSize: theme.typeBodyLgSize,
            letterSpacing: theme.typeBodyLgSize * theme.typeBodyLgTracking,
            ...(isSearch ? GEIST.regular : GEIST.semibold),
            color: disabled ? theme.colorTextMuted : theme.colorTextPrimary,
          }}
        />
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
