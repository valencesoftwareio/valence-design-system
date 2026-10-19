import { Pressable } from 'react-native';
import type { PopoverProps } from '@valencesoftwareio/types';
import { BottomSheet } from 'BottomSheet';
import { useTheme } from 'ThemeProvider';
import { Typography } from 'Typography';

export const Popover = ({ open, trigger, onOpenChange, children, label }: PopoverProps) => {
  const theme = useTheme();
  const textContent = typeof children === 'string' || typeof children === 'number';
  const textTrigger = typeof trigger === 'string' || typeof trigger === 'number';

  return (
    <>
      <Pressable
        disabled={!onOpenChange}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !onOpenChange, expanded: open }}
        onPress={() => onOpenChange?.(true)}
        style={{
          minWidth: theme.controlMinimumTarget,
          minHeight: theme.controlMinimumTarget,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {textTrigger ? <Typography variant="body">{trigger}</Typography> : trigger}
      </Pressable>
      <BottomSheet open={open} title={label} onClose={() => onOpenChange?.(false)}>
        {textContent ? <Typography variant="body">{children}</Typography> : children}
      </BottomSheet>
    </>
  );
};
