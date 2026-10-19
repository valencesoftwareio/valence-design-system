import { useEffect, useState } from 'react';
import { Animated, Easing, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { DurationPillProps } from '@valencesoftwareio/types';
import { useTheme } from 'ThemeProvider';
import { alpha } from 'color/colorMix';
import { useReduceMotion } from 'hooks/useReduceMotion';
import { GEIST } from 'foundations/fonts';

const formatDuration = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds)) {
    return '—:—';
  }

  const total = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(total / 60);
  const s = total % 60;

  return `${m}:${String(s).padStart(2, '0')}`;
};

export const DurationPill = ({ seconds, status = 'paused' }: DurationPillProps) => {
  const theme = useTheme();
  const [pulse] = useState(() => new Animated.Value(1));
  const reduceMotion = useReduceMotion();
  const duration = formatDuration(seconds);

  useEffect(() => {
    if (status !== 'live' || reduceMotion) {
      pulse.setValue(1);

      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.7,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [status, reduceMotion, pulse]);

  const activeColors =
    status === 'live'
      ? { bg: alpha(theme.colorStateYellow, 0.22), fg: theme.colorTextPrimary }
      : { bg: alpha(theme.colorTextPrimary, 0.06), fg: theme.colorTextReadable };
  const { bg, fg } =
    status === 'completed'
      ? { bg: alpha(theme.colorStatePositive, 0.16), fg: theme.colorTextPrimary }
      : activeColors;

  return (
    <Animated.View
      accessible
      accessibilityLabel={`${status}, ${duration}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacingXs,
        paddingVertical: 2,
        paddingHorizontal: theme.spacingSm,
        borderRadius: theme.radiusPill,
        backgroundColor: bg,
        opacity: status === 'live' ? pulse : 1,
      }}
    >
      <Svg width={8} height={8} viewBox="0 0 8 8">
        <Path d="M1.5 1l5 3-5 3z" fill={fg} />
      </Svg>
      <Text
        style={{
          fontSize: theme.typeMonoSize,
          letterSpacing: theme.typeMonoSize * theme.typeMonoTracking,
          ...GEIST.monoSemibold,
          color: fg,
        }}
      >
        {duration}
      </Text>
    </Animated.View>
  );
};
