import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { CheckboxProps } from '@valencesoftwareio/types';
import { useTheme } from 'ThemeProvider';
import { Typography } from 'Typography';

export const Checkbox = ({ checked, onChange, disabled, label }: CheckboxProps) => {
  const theme = useTheme();
  const isDisabled = disabled || !onChange;
  const activeBackground = checked ? theme.colorStatePositive : 'transparent';

  return (
    <Pressable
      disabled={isDisabled}
      onPress={() => onChange?.(!checked)}
      accessibilityRole="checkbox"
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
          width: 28,
          height: 28,
          borderRadius: theme.radiusSm,
          borderWidth: checked && !isDisabled ? 0 : 1.5,
          borderColor: isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl,
          backgroundColor: isDisabled ? theme.colorBackgroundSubtle : activeBackground,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && (
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
              d="M3 8l3.5 3.5L13 4.5"
              stroke={isDisabled ? theme.colorTextMuted : theme.colorTextOnPositive}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
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
