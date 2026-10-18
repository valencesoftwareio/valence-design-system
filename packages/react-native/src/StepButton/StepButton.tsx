import { Pressable } from 'react-native';
import type { StepButtonProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { alpha } from '#src/color/colorMix';
import { Typography } from '#src/Typography/Typography';
import { useReduceMotion } from '#src/hooks/useReduceMotion';

export const StepButton = ({ label, tone, disabled, onPress }: StepButtonProps) => {
  const theme = useTheme();
  const isDisabled = disabled || !onPress;
  const reduceMotion = useReduceMotion();
  const base = tone === 'positive' ? theme.colorStatePositive : theme.colorStateRed;
  const baseAlpha = tone === 'positive' ? 0.16 : 0.14;
  const fg = isDisabled ? theme.colorTextMuted : theme.colorTextPrimary;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => ({
        minHeight: theme.controlMinimumTarget,
        paddingVertical: theme.spacingSm,
        paddingHorizontal: theme.spacingMd,
        borderRadius: theme.radiusControl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDisabled
          ? alpha(theme.colorTextPrimary, 0.04)
          : alpha(base, pressed ? 0.32 : baseAlpha),
        transform: [{ scale: pressed && !isDisabled && !reduceMotion ? 0.95 : 1 }],
        ...(isDisabled && { borderWidth: 1, borderColor: theme.colorBorderPrimary }),
      })}
    >
      <Typography variant="badge" style={{ color: fg }}>
        {label}
      </Typography>
    </Pressable>
  );
};
