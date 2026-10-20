import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MenuProps } from '@valencesoftwareio/types';
import { ChevronRightIcon } from 'lucide-react-native';
import { useTheme } from '@/ThemeProvider';
import { Typography } from '@/Typography';

export const Menu = ({ label, items, disabled, onAction }: MenuProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const isDisabled = disabled || !onAction;

  const select = (value: string) => {
    setOpen(false);
    onAction?.(value);
  };

  return (
    <>
      <Pressable
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, expanded: open }}
        onPress={() => setOpen(true)}
        style={{
          minWidth: 160,
          minHeight: theme.controlMinimumTarget,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacingSm,
          paddingHorizontal: theme.spacingMd,
          borderWidth: 1,
          borderColor: isDisabled ? theme.colorBorderPrimary : theme.colorBorderControl,
          borderRadius: theme.radiusControl,
          backgroundColor: isDisabled ? theme.colorBackgroundSubtle : theme.colorBackgroundRaised,
        }}
      >
        <Typography
          variant="controlLabel"
          style={{
            flex: 1,
            color: isDisabled ? theme.colorTextMuted : theme.colorTextPrimary,
          }}
        >
          {label}
        </Typography>
        <View style={{ transform: [{ rotate: '90deg' }] }}>
          <ChevronRightIcon
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            size={14}
            color={theme.colorTextSecondary}
            strokeWidth={1.6}
            absoluteStrokeWidth
          />
        </View>
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          accessible={false}
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: insets.top,
            backgroundColor: 'rgba(0, 0, 0, 0.42)',
          }}
        >
          <Pressable
            accessible={false}
            accessibilityViewIsModal
            onPress={(event) => event.stopPropagation()}
            style={{
              maxHeight: '70%',
              paddingTop: theme.spacingSm,
              paddingRight: theme.spacingSm,
              paddingBottom: Math.max(theme.spacingSm, insets.bottom),
              paddingLeft: theme.spacingSm,
              borderTopLeftRadius: theme.radiusLg,
              borderTopRightRadius: theme.radiusLg,
              backgroundColor: theme.colorBackgroundRaised,
              boxShadow: theme.shadowOverlay,
            }}
          >
            <ScrollView accessibilityRole="menu">
              {items.map((item) => {
                let color = theme.colorTextPrimary;

                if (item.danger) {
                  color = theme.colorActionDangerText;
                }

                if (item.disabled) {
                  color = theme.colorTextMuted;
                }

                return (
                  <Pressable
                    key={item.value}
                    disabled={item.disabled}
                    accessibilityRole="menuitem"
                    onPress={() => select(item.value)}
                    style={{
                      minHeight: theme.controlMinimumTarget,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: theme.spacingSm,
                      paddingHorizontal: theme.spacingMd,
                      borderRadius: theme.radiusControl,
                    }}
                  >
                    {item.icon != null && (
                      <View>
                        {typeof item.icon === 'string' || typeof item.icon === 'number' ? (
                          <Typography variant="body" style={{ color }}>
                            {item.icon}
                          </Typography>
                        ) : (
                          item.icon(color)
                        )}
                      </View>
                    )}
                    <Typography variant="body" style={{ color }}>
                      {item.label}
                    </Typography>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
