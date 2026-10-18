import { Pressable, View } from 'react-native';
import type { ChipProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { lighten } from '#src/color/colorMix';
import { Typography } from '#src/Typography/Typography';
import { useReduceMotion } from '#src/hooks/useReduceMotion';

export const Chip = ({ selected, disabled, icon, onPress, children }: ChipProps) => {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const isDisabled = disabled || !onPress;
  const enabledForeground = selected ? theme.colorBackgroundPrimary : theme.colorTextPrimary;
  const fg = isDisabled ? theme.colorTextMuted : enabledForeground;
  const enabledBorder = selected ? 'transparent' : theme.colorBorderControl;
  const borderColor = isDisabled ? theme.colorBorderPrimary : enabledBorder;

  const background = (pressed: boolean): string => {
    if (isDisabled) {
      return theme.colorBackgroundSubtle;
    }

    if (selected) {
      return pressed ? lighten(theme.colorTextPrimary, 0.2) : theme.colorTextPrimary;
    }

    return pressed ? theme.colorBorderPrimary : theme.colorBackgroundRaised;
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected: Boolean(selected) }}
      style={({ pressed }) => ({
        minHeight: theme.controlMinimumTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: theme.spacingMd,
        borderRadius: theme.radiusPill,
        backgroundColor: background(pressed),
        borderWidth: 1,
        borderColor,
        transform: [{ scale: pressed && !isDisabled && !reduceMotion ? 0.96 : 1 }],
      })}
    >
      {icon != null && (
        <View>
          {typeof icon === 'string' || typeof icon === 'number' ? (
            <Typography variant="label" style={{ color: fg }}>
              {icon}
            </Typography>
          ) : (
            icon(fg)
          )}
        </View>
      )}
      <Typography variant="label" style={{ color: fg }}>
        {children}
      </Typography>
    </Pressable>
  );
};
