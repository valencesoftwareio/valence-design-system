import { useEffect, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomSheetProps } from '@valencesoftwareio/types';
import { ThemeContext, useTheme } from '@/ThemeProvider';
import { Typography } from '@/Typography';

export const BottomSheet = ({ open, title, onClose, children }: BottomSheetProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const sheet = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (open) {
      sheet.current?.present();
    } else {
      sheet.current?.close();
    }
  }, [open]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      accessibilityRole="button"
      accessibilityLabel="Close sheet"
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.42}
      pressBehavior="close"
      onPress={onClose}
    />
  );

  return (
    <BottomSheetModal
      ref={sheet}
      accessible={false}
      enableDynamicSizing
      enablePanDownToClose
      maxDynamicContentSize={Math.max(0, height - insets.top)}
      topInset={insets.top}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableBlurKeyboardOnGesture
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colorBackgroundPrimary }}
      handleIndicatorStyle={{ width: 36, height: 4, backgroundColor: theme.colorBorderControl }}
      style={{ boxShadow: theme.shadowOverlay }}
      onDismiss={() => {
        if (open) {
          onClose();
        }
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemeContext.Provider value={theme}>
          <Typography variant="titleSm">{title}</Typography>
          {children != null && <View style={{ marginTop: theme.spacingMd }}>{children}</View>}
        </ThemeContext.Provider>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
