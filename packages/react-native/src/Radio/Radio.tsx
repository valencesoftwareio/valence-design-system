import { useEffect, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import type { RadioProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { Typography } from '#src/Typography/Typography';
import { useReduceMotion } from '#src/hooks/useReduceMotion';

export const Radio = ({ checked, onChange, disabled, label }: RadioProps) => {
  const theme = useTheme();
  const [dotScale] = useState(() => new Animated.Value(checked ? 1 : 0));
  const reduceMotion = useReduceMotion();
  const isDisabled = disabled || !onChange;
  const activeBorder = checked ? theme.colorTextPrimary : theme.colorBorderControl;
  const borderColor = isDisabled ? theme.colorBorderPrimary : activeBorder;

  useEffect(() => {
    const animation = Animated.timing(dotScale, {
      toValue: checked ? 1 : 0,
      duration: reduceMotion ? 0 : 120,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [checked, dotScale, reduceMotion]);

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => onChange?.()}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled: isDisabled }}
      accessibilityLabel={label}
      style={{
        minHeight: theme.controlMinimumTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacingMd,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: theme.radiusPill,
          borderWidth: 1.5,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: 12,
            height: 12,
            borderRadius: theme.radiusPill,
            backgroundColor: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary,
            transform: [{ scale: dotScale }],
          }}
        />
      </View>
      <Typography
        variant="body"
        style={{ color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary }}
      >
        {label}
      </Typography>
    </Pressable>
  );
};
