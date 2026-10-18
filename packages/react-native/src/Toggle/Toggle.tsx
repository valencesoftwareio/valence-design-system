import { useEffect, useState } from 'react';
import { Animated, I18nManager, Pressable } from 'react-native';
import type { ToggleProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { alpha } from '#src/color/colorMix';
import { Typography } from '#src/Typography/Typography';
import { useReduceMotion } from '#src/hooks/useReduceMotion';

export const Toggle = ({ checked, onChange, disabled, label }: ToggleProps) => {
  const theme = useTheme();
  const isDisabled = disabled || !onChange;
  const [anim] = useState(() => new Animated.Value(checked ? 1 : 0));
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    const animation = Animated.timing(anim, {
      toValue: checked ? 1 : 0,
      duration: reduceMotion ? 0 : 180,
      useNativeDriver: false,
    });
    animation.start();

    return () => animation.stop();
  }, [checked, anim, reduceMotion]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: isDisabled
      ? [theme.colorBackgroundSubtle, alpha(theme.colorStatePositive, 0.16)]
      : [theme.colorBorderPrimary, theme.colorStatePositive],
  });
  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, I18nManager.isRTL ? -20 : 20],
  });

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => onChange?.(!checked)}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: isDisabled }}
      accessibilityLabel={label}
      style={{
        minHeight: theme.controlMinimumTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacingMd,
      }}
    >
      <Animated.View
        style={{
          width: theme.controlSwitchWidth,
          height: theme.controlSwitchHeight,
          borderRadius: theme.radiusPill,
          backgroundColor: trackColor,
          borderWidth: 1,
          borderColor: isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl,
          padding: 2,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 28,
            height: 28,
            borderRadius: theme.radiusPill,
            backgroundColor: theme.colorBackgroundRaised,
            shadowColor: `rgb(${theme.colorShadowTint})`,
            shadowOpacity: 0.25,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
            transform: [{ translateX: thumbTranslate }],
          }}
        />
      </Animated.View>
      <Typography
        variant="body"
        style={{ color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary }}
      >
        {label}
      </Typography>
    </Pressable>
  );
};
