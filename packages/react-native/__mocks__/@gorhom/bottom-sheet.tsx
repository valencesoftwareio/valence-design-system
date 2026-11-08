import { useImperativeHandle, useState, type ComponentType, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  View,
  type AccessibilityRole,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface BackdropProps {
  pressBehavior?: string;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  onPress?: () => void;
}

interface ModalProps {
  ref?: Ref<ModalHandle>;
  children?: ReactNode;
  backdropComponent?: ComponentType<BackdropProps>;
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean;
  topInset?: number;
  maxDynamicContentSize?: number;
  keyboardBehavior?: string;
  keyboardBlurBehavior?: string;
  android_keyboardInputMode?: string;
  onDismiss?: () => void;
}

interface ModalHandle {
  present: () => void;
  close: () => void;
}

export const BottomSheetModal = ({
  children,
  backdropComponent: Backdrop,
  onDismiss,
  ref,
  ...props
}: ModalProps) => {
  const [visible, setVisible] = useState(false);

  const dismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  useImperativeHandle(ref, () => ({
    present: () => setVisible(true),
    close: () => {
      if (visible) {
        dismiss();
      }
    },
  }));

  if (!visible) {
    return null;
  }

  return (
    <View testID="bottom-sheet" {...props}>
      <Pressable testID="bottom-sheet-user-dismiss" onPress={dismiss} />
      {Backdrop && <Backdrop />}
      {children}
    </View>
  );
};

export const BottomSheetBackdrop = ({
  pressBehavior,
  onPress,
  accessibilityLabel,
  accessibilityRole,
}: BackdropProps) => {
  return (
    <Pressable
      onPress={pressBehavior === 'none' ? undefined : onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    />
  );
};

export const BottomSheetScrollView = ({
  children,
  contentContainerStyle,
}: {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) => {
  return <View style={contentContainerStyle}>{children}</View>;
};
