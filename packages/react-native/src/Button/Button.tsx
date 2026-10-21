import { useState, type Ref } from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import type { ButtonProps, ButtonKind, TypographyVariant } from '@valencesoftwareio/types';
import { useTheme } from '@/ThemeProvider';
import { lighten, alpha } from '@/color/colorMix';
import { Spinner } from '@/Spinner';
import { Typography } from '@/Typography';
import { useReduceMotion } from '@/hooks/useReduceMotion';

const TEXT_VARIANT: Record<ButtonKind, TypographyVariant> = {
  primary: 'controlLabel',
  secondary: 'controlLabel',
  ghost: 'controlLabel',
  danger: 'controlLabel',
  dangerConfirm: 'controlLabel',
  pill: 'badge',
};

type ButtonComponentProps = ButtonProps & { ref?: Ref<View> };

export const Button = ({
  kind = 'primary',
  disabled,
  loading,
  onPress,
  children,
  ref,
}: ButtonComponentProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReduceMotion();
  const standardPadding = kind === 'ghost' ? theme.spacingMd : theme.spacingLg;
  const paddingHorizontal = kind === 'pill' ? 14 : standardPadding;
  const borderRadius = kind === 'pill' ? theme.radiusPill : theme.radiusControl;
  const isUnavailable = disabled || !onPress;
  const isDisabled = isUnavailable || loading;

  const colors = (pressed: boolean): { bg: string; fg: string; border?: string } => {
    if (isUnavailable) {
      switch (kind) {
        case 'primary':
        case 'pill':
          return {
            bg: alpha(theme.colorTextPrimary, 0.12),
            fg: theme.colorTextMuted,
            border: theme.colorBorderPrimary,
          };
        case 'dangerConfirm':
          return {
            bg: alpha(theme.colorTextPrimary, 0.04),
            fg: theme.colorTextMuted,
            border: theme.colorBorderPrimary,
          };
        case 'secondary':
        case 'danger':
          return {
            bg: alpha(theme.colorTextPrimary, 0.04),
            fg: theme.colorTextMuted,
            border: theme.colorBorderPrimary,
          };
        default:
          return {
            bg: alpha(theme.colorTextPrimary, 0.04),
            fg: theme.colorTextMuted,
            border: theme.colorBorderPrimary,
          };
      }
    }

    switch (kind) {
      case 'primary':
      case 'pill':
        return {
          bg: pressed ? lighten(theme.colorTextPrimary, 0.2) : theme.colorTextPrimary,
          fg: theme.colorBackgroundPrimary,
        };
      case 'secondary':
        return {
          bg: pressed ? alpha(theme.colorTextPrimary, 0.08) : 'transparent',
          fg: theme.colorTextPrimary,
          border: pressed ? theme.colorTextSecondary : theme.colorBorderControl,
        };
      case 'ghost':
        return {
          bg: pressed ? alpha(theme.colorTextPrimary, 0.08) : 'transparent',
          fg: pressed ? theme.colorTextPrimary : theme.colorTextSecondary,
        };
      case 'danger':
        return {
          bg: 'transparent',
          fg: theme.colorActionDangerText,
          border: pressed ? theme.colorActionDangerText : theme.colorBorderControl,
        };
      case 'dangerConfirm':
        return {
          bg: theme.colorStateRedStrong,
          fg: theme.colorTextOnDanger,
        };
    }
  };

  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: Boolean(loading) }}
      style={({ pressed }) => {
        const c = colors(pressed);
        const style: ViewStyle = {
          minHeight: theme.controlMinimumTarget,
          paddingVertical: theme.spacingSm,
          paddingHorizontal,
          borderRadius,
          backgroundColor: c.bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: theme.spacingSm,
          transform: [{ scale: pressed && !isDisabled && !reduceMotion ? 0.97 : 1 }],
          borderWidth: 1,
          borderColor: c.border ?? 'transparent',
          ...(focused && {
            outlineWidth: 3,
            outlineColor: theme.colorBorderFocus,
            outlineStyle: 'solid',
          }),
        };

        return style;
      }}
    >
      <Typography
        variant={TEXT_VARIANT[kind]}
        style={{ color: colors(false).fg, opacity: loading ? 0 : 1 }}
      >
        {children}
      </Typography>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner size={14} color={colors(false).fg} />
        </View>
      )}
    </Pressable>
  );
};
