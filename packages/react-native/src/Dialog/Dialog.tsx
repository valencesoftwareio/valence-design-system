import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DialogProps } from '@valencesoftwareio/types';
import { XIcon } from '../icons';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { Typography } from '../Typography/Typography';

const closeIcon = (color: string) => (
  <XIcon
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    size={18}
    color={color}
    strokeWidth={1.6}
    absoluteStrokeWidth
  />
);

export const Dialog = ({
  open,
  title,
  onClose,
  showCloseButton = true,
  dismissOnOutsidePress = true,
  children,
  actions,
}: DialogProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const textContent = typeof children === 'string' || typeof children === 'number';

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <Pressable
        accessible={false}
        onPress={dismissOnOutsidePress ? onClose : undefined}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: Math.max(theme.spacingLg, insets.top),
          paddingRight: theme.spacingLg,
          paddingBottom: Math.max(theme.spacingLg, insets.bottom),
          paddingLeft: theme.spacingLg,
          backgroundColor: 'rgba(0, 0, 0, 0.48)',
        }}
      >
        <Pressable
          accessible={false}
          accessibilityViewIsModal
          onPress={(event) => event.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 480,
            maxHeight: '90%',
            padding: theme.spacingLg,
            borderRadius: theme.radiusLg,
            backgroundColor: theme.colorBackgroundRaised,
            boxShadow: theme.shadowOverlay,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacingMd }}>
            <Typography variant="titleSm" style={{ flex: 1 }}>
              {title}
            </Typography>
            {showCloseButton && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={onClose}
                style={({ pressed }) => ({
                  width: theme.controlMinimumTarget,
                  height: theme.controlMinimumTarget,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -theme.spacingSm,
                  marginRight: -theme.spacingSm,
                  borderRadius: theme.radiusControl,
                  backgroundColor: pressed ? theme.colorBackgroundSubtle : 'transparent',
                })}
              >
                {closeIcon(theme.colorTextSecondary)}
              </Pressable>
            )}
          </View>
          {children != null && (
            <ScrollView style={{ marginTop: theme.spacingMd }}>
              {textContent ? <Typography variant="body">{children}</Typography> : children}
            </ScrollView>
          )}
          {actions != null && (
            <View
              style={{
                marginTop: theme.spacingLg,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: theme.spacingSm,
              }}
            >
              {actions}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
