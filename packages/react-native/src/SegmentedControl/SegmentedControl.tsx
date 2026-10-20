import { useEffect, useState } from 'react';
import { Animated, I18nManager, Pressable, View, type LayoutChangeEvent } from 'react-native';
import type { SegmentedControlProps } from '@valencesoftwareio/types';
import { useTheme } from '@/ThemeProvider';
import { Typography } from '@/Typography';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export const SegmentedControl = ({
  options,
  value,
  onChange,
  disabled,
  label,
}: SegmentedControlProps) => {
  const theme = useTheme();
  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const isDisabled = Boolean(disabled || !onChange);
  const [anim] = useState(() => new Animated.Value(Math.max(0, selectedIndex)));
  const [groupWidth, setGroupWidth] = useState(0);
  const indicatorWidth = options.length > 0 ? (groupWidth - 6) / options.length : 0;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    const animation = Animated.timing(anim, {
      toValue: Math.max(0, selectedIndex),
      duration: reduceMotion ? 0 : 180,
      useNativeDriver: false,
    });
    animation.start();

    return () => animation.stop();
  }, [selectedIndex, anim, reduceMotion]);

  if (options.length === 0) {
    return null;
  }

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      onLayout={(e: LayoutChangeEvent) => setGroupWidth(e.nativeEvent.layout.width)}
      style={{
        minHeight: theme.controlMinimumTarget,
        flexDirection: 'row',
        backgroundColor: theme.colorBackgroundPrimary,
        borderRadius: theme.radiusMd,
        padding: 3,
      }}
    >
      {groupWidth > 0 && selectedIndex !== -1 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 3,
            bottom: 3,
            ...(I18nManager.isRTL ? { right: 3 } : { left: 3 }),
            width: indicatorWidth,
            borderRadius: theme.radiusControl,
            backgroundColor: isDisabled ? theme.colorBackgroundSubtle : theme.colorBackgroundRaised,
            borderWidth: 1,
            borderColor: isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl,
            shadowColor: `rgb(${theme.colorShadowTint})`,
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
            transform: [
              {
                translateX: Animated.multiply(
                  anim,
                  I18nManager.isRTL ? -indicatorWidth : indicatorWidth,
                ),
              },
            ],
          }}
        />
      )}
      {options.map((opt) => {
        const selected = opt.value === value;
        const selectedColor = selected ? theme.colorTextPrimary : theme.colorTextSecondary;
        const contentColor = isDisabled ? theme.colorTextMuted : selectedColor;
        const iconTextColor = isDisabled ? theme.colorTextMuted : theme.colorTextPrimary;

        return (
          <Pressable
            key={opt.value}
            disabled={isDisabled}
            onPress={() => onChange?.(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled: isDisabled }}
            style={{
              minHeight: theme.controlMinimumTarget,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              paddingVertical: 10,
              paddingHorizontal: 6,
              borderRadius: theme.radiusControl,
            }}
          >
            {opt.icon != null &&
              (typeof opt.icon === 'string' || typeof opt.icon === 'number' ? (
                <Typography variant="body" style={{ color: iconTextColor }}>
                  {opt.icon}
                </Typography>
              ) : (
                opt.icon(contentColor)
              ))}
            <Typography variant="controlLabel" style={{ color: contentColor }}>
              {opt.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
};
