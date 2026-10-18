import NativeSlider from '@react-native-community/slider';
import type { SliderProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';

export const Slider = ({
  value,
  max,
  min = 0,
  step = 1,
  onChange,
  disabled,
  label,
}: SliderProps) => {
  const theme = useTheme();
  const rangeInvalid = !Number.isFinite(min) || !Number.isFinite(max) || min > max;
  const safeMin = rangeInvalid ? 0 : min;
  const safeMax = rangeInvalid ? 0 : max;
  const safeValue = Number.isFinite(value) ? Math.min(safeMax, Math.max(safeMin, value)) : safeMin;
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const isDisabled = Boolean(disabled || rangeInvalid || !onChange);

  return (
    <NativeSlider
      value={safeValue}
      minimumValue={safeMin}
      maximumValue={safeMax}
      step={safeStep}
      disabled={isDisabled}
      onValueChange={onChange}
      accessibilityLabel={label}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: safeMin, max: safeMax, now: safeValue }}
      accessibilityState={{ disabled: isDisabled }}
      minimumTrackTintColor={isDisabled ? theme.colorBorderPrimary : theme.colorTextPrimary}
      maximumTrackTintColor={isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl}
      thumbTintColor={isDisabled ? theme.colorTextMuted : theme.colorTextPrimary}
      thumbSize={theme.controlSliderHandle}
      tapToSeek
      style={{ height: theme.controlMinimumTarget }}
    />
  );
};
