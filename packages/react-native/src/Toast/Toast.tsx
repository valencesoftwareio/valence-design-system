import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import type { ToastProps } from '@valencesoftwareio/types';
import { XIcon } from 'lucide-react-native';
import { useTheme } from 'ThemeProvider';
import { Typography } from 'Typography';

export const Toast = ({
  open,
  message,
  tone = 'info',
  duration = 5000,
  actionLabel,
  onAction,
  onDismiss,
}: ToastProps) => {
  const theme = useTheme();

  useEffect(() => {
    if (!open || !onDismiss || duration <= 0) {
      return;
    }

    const timeout = setTimeout(onDismiss, duration);

    return () => clearTimeout(timeout);
  }, [duration, onDismiss, open]);

  if (!open) {
    return null;
  }

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
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={{
        position: 'absolute',
        zIndex: 1100,
        left: theme.spacingLg,
        right: theme.spacingLg,
        bottom: theme.spacingLg,
        minHeight: theme.controlMinimumTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacingMd,
        padding: theme.spacingMd,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: theme.radiusControl,
        backgroundColor: colors.background,
        boxShadow: theme.shadowOverlay,
      }}
    >
      <Typography variant="body" style={{ flex: 1, color: colors.text }}>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={{ minHeight: theme.controlMinimumTarget, justifyContent: 'center' }}
        >
          <Typography variant="controlLabel" style={{ color: colors.text }}>
            {actionLabel}
          </Typography>
        </Pressable>
      )}
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onDismiss}
          style={{
            width: theme.controlMinimumTarget,
            height: theme.controlMinimumTarget,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <XIcon
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            size={16}
            color={colors.text}
            strokeWidth={1.6}
            absoluteStrokeWidth
          />
        </Pressable>
      )}
    </View>
  );
};
