import { useState } from 'react';
import { Pressable, View } from 'react-native';
import type { NumberFieldProps } from '@valencesoftwareio/types';
import { useTheme } from '@/ThemeProvider';
import { Typography } from '@/Typography';

export const NumberField = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
  error,
  label,
}: NumberFieldProps) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const safeMin = min != null && Number.isFinite(min) ? min : -Infinity;
  const safeMax = max != null && Number.isFinite(max) ? max : Infinity;
  const rangeInvalid =
    (min != null && !Number.isFinite(min)) ||
    (max != null && !Number.isFinite(max)) ||
    safeMin > safeMax;
  const finiteMaxFallback = Number.isFinite(safeMax) ? safeMax : 0;
  const fallbackValue = Number.isFinite(safeMin) ? safeMin : finiteMaxFallback;
  const boundedValue = rangeInvalid ? value : Math.min(safeMax, Math.max(safeMin, value));
  const safeValue = Number.isFinite(value) ? boundedValue : fallbackValue;
  const atMin = safeValue <= safeMin;
  const atMax = safeValue >= safeMax;
  const effectiveStep = Math.abs(step);
  const stepInvalid = !Number.isFinite(effectiveStep) || effectiveStep === 0;
  let borderColor = focused ? theme.colorBorderFocus : theme.colorBorderControl;

  if (error) {
    borderColor = theme.colorActionDangerText;
  }

  if (disabled) {
    borderColor = theme.colorBorderPrimary;
  }

  return (
    <View style={{ gap: 6 }}>
      <Typography variant="label" style={{ color: theme.colorTextPrimary }}>
        {label}
      </Typography>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'stretch',
          backgroundColor: disabled ? theme.colorBackgroundSubtle : theme.colorBackgroundPrimary,
          borderRadius: theme.radiusControl,
          overflow: 'hidden',
          minWidth: 148,
          minHeight: theme.controlMinimumTarget,
          borderWidth: 1.5,
          borderColor,
        }}
      >
        <Pressable
          disabled={disabled || rangeInvalid || atMin || stepInvalid || !onChange}
          accessibilityLabel={`Decrease ${label}`}
          accessibilityRole="button"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPress={() => onChange?.(Math.max(safeMin, safeValue - effectiveStep))}
          style={{
            width: theme.controlMinimumTarget,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="numeral"
            style={{
              color:
                atMin || disabled || stepInvalid ? theme.colorTextMuted : theme.colorTextSecondary,
            }}
          >
            −
          </Typography>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Typography
            variant="numeral"
            style={{ color: disabled ? theme.colorTextMuted : theme.colorTextPrimary }}
          >
            {safeValue}
          </Typography>
        </View>
        <Pressable
          disabled={disabled || rangeInvalid || atMax || stepInvalid || !onChange}
          accessibilityLabel={`Increase ${label}`}
          accessibilityRole="button"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPress={() => onChange?.(Math.min(safeMax, safeValue + effectiveStep))}
          style={{
            width: theme.controlMinimumTarget,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="numeral"
            style={{
              color:
                atMax || disabled || stepInvalid ? theme.colorTextMuted : theme.colorTextSecondary,
            }}
          >
            +
          </Typography>
        </Pressable>
      </View>
    </View>
  );
};
