import { Linking, Pressable } from 'react-native';
import type { LinkProps } from '@valencesoftwareio/types';
import { useTheme } from 'ThemeProvider';
import { Typography } from 'Typography';

export const Link = ({ href, disabled, onPress, children }: LinkProps) => {
  const theme = useTheme();

  const activate = () => {
    if (onPress) {
      onPress();

      return;
    }

    void Linking.openURL(href);
  };

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="link"
      accessibilityState={{ disabled: Boolean(disabled) }}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      onPress={activate}
    >
      <Typography
        variant="body"
        style={{
          color: disabled ? theme.colorTextMuted : theme.colorTextPrimary,
          textDecorationLine: 'underline',
        }}
      >
        {children}
      </Typography>
    </Pressable>
  );
};
