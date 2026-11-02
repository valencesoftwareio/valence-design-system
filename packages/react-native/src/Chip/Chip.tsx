import { Pressable, View, type ViewStyle } from 'react-native';
import type { ChipProps } from '@valencesoftwareio/types';
import { useTheme } from '@/ThemeProvider';
import { lighten } from '@/color/colorMix';
import { Typography } from '@/Typography';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export const Chip = ({ selected, disabled, icon, onPress, children }: ChipProps) => {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const isDisabled = Boolean(disabled);
  const enabledForeground = selected ? theme.colorBackgroundPrimary : theme.colorTextPrimary;
  const fg = isDisabled ? theme.colorTextMuted : enabledForeground;
  const enabledBorder = selected ? 'transparent' : theme.colorBorderControl;
  const borderColor = isDisabled ? theme.colorBorderPrimary : enabledBorder;
  let backgroundColor = theme.colorBackgroundRaised;
  const content = (
    <>
      {icon != null && (
        <View>
          {typeof icon === 'string' || typeof icon === 'number' ? (
            <Typography variant={onPress ? 'label' : 'badge'} style={{ color: fg }}>
              {icon}
            </Typography>
          ) : (
            icon(fg)
          )}
        </View>
      )}
      <Typography variant={onPress ? 'label' : 'badge'} style={{ color: fg }}>
        {children}
      </Typography>
    </>
  );

  if (selected) {
    backgroundColor = theme.colorTextPrimary;
  }

  if (isDisabled) {
    backgroundColor = theme.colorBackgroundSubtle;
  }

  if (!onPress) {
    return (
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: theme.colorBackgroundSubtle,
          borderRadius: theme.radiusPill,
          flexDirection: 'row',
          gap: theme.spacingXs,
          paddingHorizontal: theme.spacingSm,
          paddingVertical: 2,
        }}
      >
        {content}
      </View>
    );
  }

  const style: ViewStyle = {
    alignItems: 'center',
    backgroundColor,
    borderColor,
    borderRadius: theme.radiusPill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: theme.spacingMd,
    paddingVertical: 6,
  };

  const getBackground = (pressed: boolean): string => {
    if (!pressed || isDisabled) {
      return backgroundColor;
    }

    if (selected) {
      return lighten(theme.colorTextPrimary, 0.2);
    }

    return theme.colorBorderPrimary;
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected: Boolean(selected) }}
      style={({ pressed }) => ({
        ...style,
        backgroundColor: getBackground(pressed),
        minHeight: theme.controlMinimumTarget,
        transform: [{ scale: pressed && !isDisabled && !reduceMotion ? 0.96 : 1 }],
      })}
    >
      {content}
    </Pressable>
  );
};
