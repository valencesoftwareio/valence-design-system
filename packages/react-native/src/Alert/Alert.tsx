import { View } from 'react-native';
import type { AlertProps } from '@valencesoftwareio/types';
import { useTheme } from '@/ThemeProvider';
import { Typography } from '@/Typography';

export const Alert = ({ tone = 'info', title, children }: AlertProps) => {
  const theme = useTheme();
  const textContent = typeof children === 'string' || typeof children === 'number';
  const accessibilityLabel = textContent ? [title, children].filter(Boolean).join('. ') : title;
  const colors = {
    info: {
      background: theme.colorBackgroundRaised,
      border: theme.colorBorderControl,
      text: theme.colorTextPrimary,
    },
    success: {
      background: theme.colorStatePositive,
      border: theme.colorStatePositive,
      text: theme.colorTextOnPositive,
    },
    warning: {
      background: theme.colorStateYellow,
      border: theme.colorStateYellow,
      text: theme.colorTextOnYellow,
    },
    danger: {
      background: theme.colorStateRedStrong,
      border: theme.colorStateRedStrong,
      text: theme.colorTextOnDanger,
    },
  }[tone];

  return (
    <View
      accessibilityRole={tone === 'danger' ? 'alert' : 'summary'}
      accessibilityLabel={accessibilityLabel}
      style={{
        width: '100%',
        gap: theme.spacingSm,
        padding: theme.spacingMd,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: theme.radiusControl,
        backgroundColor: colors.background,
      }}
    >
      {title && (
        <Typography variant="bodyLg" accessibilityRole="header" style={{ color: colors.text }}>
          {title}
        </Typography>
      )}
      <Typography variant="body" style={{ color: colors.text }}>
        {children}
      </Typography>
    </View>
  );
};
