import { Pressable, View } from 'react-native';
import type { IconButtonProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { Typography } from '#src/Typography/Typography';
import { useReduceMotion } from '#src/hooks/useReduceMotion';

export const IconButton = ({
  icon,
  label,
  tone = 'default',
  disabled,
  onPress,
}: IconButtonProps) => {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const isDisabled = disabled || !onPress;
  let color = theme.colorTextPrimary;

  if (tone === 'danger') {
    color = theme.colorActionDangerText;
  }

  if (isDisabled) {
    color = theme.colorTextMuted;
  }

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
      style={({ pressed }) => ({
        width: theme.controlMinimumTarget,
        height: theme.controlMinimumTarget,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl,
        borderRadius: theme.radiusControl,
        backgroundColor: pressed ? theme.colorBackgroundSubtle : theme.colorBackgroundRaised,
        transform: [{ scale: pressed && !reduceMotion ? 0.96 : 1 }],
      })}
    >
      <View>
        {typeof icon === 'string' || typeof icon === 'number' ? (
          <Typography variant="body" style={{ color }}>
            {icon}
          </Typography>
        ) : (
          icon(color)
        )}
      </View>
    </Pressable>
  );
};
