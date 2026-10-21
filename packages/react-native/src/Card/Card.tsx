import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { CardProps } from '@valencesoftwareio/types';
import { useTheme } from '@/ThemeProvider';
import { alpha } from '@/color/colorMix';
import { Typography } from '@/Typography';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export const Card = ({ status = 'resting', title, actionLabel, onPress, children }: CardProps) => {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReduceMotion();
  const describedChildren =
    typeof children === 'string' || typeof children === 'number' ? children : undefined;
  const computedActionLabel =
    actionLabel ??
    [title, status !== 'resting' ? status : undefined, describedChildren]
      .filter(Boolean)
      .join(', ');
  const restingBackground =
    status === 'skipped' ? alpha(theme.colorTextPrimary, 0.04) : theme.colorBackgroundRaised;
  const background = status === 'success' ? theme.colorStatePositive : restingBackground;
  const contentColor = status === 'success' ? theme.colorTextOnPositive : undefined;
  const titleColor = contentColor ?? theme.colorTextReadable;
  const restingShadow =
    status === 'error'
      ? `0 0 0 1.5px ${theme.colorActionDangerText}, ${theme.shadowSurface}`
      : theme.shadowSurface;
  const boxShadow =
    status === 'editing'
      ? `inset 0 0 0 2px ${theme.colorTextPrimary}, ${theme.shadowSurface}`
      : restingShadow;

  return (
    <View
      style={{
        borderRadius: theme.radiusLg,
        padding: 14,
        backgroundColor: background,
        boxShadow,
        transform: [{ scale: pressed && !reduceMotion ? 0.985 : 1 }],
      }}
    >
      {onPress && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={computedActionLabel}
          onPress={onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View
        style={{ gap: 6 }}
        pointerEvents="none"
        accessibilityElementsHidden={Boolean(onPress)}
        importantForAccessibility={onPress ? 'no-hide-descendants' : 'auto'}
      >
        <Typography variant="eyebrow" style={{ color: titleColor }}>
          {title}
        </Typography>
        {children != null &&
          (describedChildren != null ? (
            <Typography
              variant="body"
              style={{ lineHeight: 22, ...(contentColor && { color: contentColor }) }}
            >
              {describedChildren}
            </Typography>
          ) : (
            children
          ))}
      </View>
    </View>
  );
};
