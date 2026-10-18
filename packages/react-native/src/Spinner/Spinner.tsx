import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { SpinnerProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';
import { useReduceMotion } from '#src/hooks/useReduceMotion';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const Spinner = ({ size = 14, color }: SpinnerProps) => {
  const theme = useTheme();
  const strokeColor = color ?? theme.colorTextPrimary;
  const [spin] = useState(() => new Animated.Value(0));
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      spin.stopAnimation();
      spin.setValue(0);

      return;
    }

    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    return () => loop.stop();
  }, [reduceMotion, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <AnimatedSvg width={size} height={size} viewBox="0 0 24 24" style={{ transform: [{ rotate }] }}>
      <Circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke={strokeColor}
        strokeOpacity={0.35}
        strokeWidth={3}
      />
      <Path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </AnimatedSvg>
  );
};
