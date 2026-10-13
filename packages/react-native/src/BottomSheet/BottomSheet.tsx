import { useWindowDimensions, View } from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomSheetProps } from '@valencesoftwareio/types';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { Typography } from '../Typography/Typography';

export const BottomSheet = ({ open, title, onClose, children }: BottomSheetProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

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
    <GorhomBottomSheet
      accessible={false}
      index={open ? 0 : -1}
      snapPoints={['50%']}
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
      onChange={(index) => {
        if (index === -1 && open) {
          onClose();
        }
      }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: Math.max(24, insets.bottom),
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Typography variant="titleSm">{title}</Typography>
        {children != null && <View style={{ marginTop: theme.spacingMd }}>{children}</View>}
      </BottomSheetScrollView>
    </GorhomBottomSheet>
  );
};
