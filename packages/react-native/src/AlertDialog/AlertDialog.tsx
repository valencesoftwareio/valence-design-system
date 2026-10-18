import { View } from 'react-native';
import type { AlertDialogProps } from '@valencesoftwareio/types';
import { Button } from 'Button';
import { Dialog } from 'Dialog';
import { Typography } from 'Typography';

export const AlertDialog = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  danger,
  loading,
}: AlertDialogProps) => {
  return (
    <Dialog
      open={open}
      title={title}
      onClose={onClose}
      showCloseButton={false}
      dismissOnOutsidePress={false}
      actions={
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Button kind="secondary" onPress={onClose}>
            {cancelLabel}
          </Button>
          <Button kind={danger ? 'dangerConfirm' : 'primary'} loading={loading} onPress={onConfirm}>
            {confirmLabel}
          </Button>
        </View>
      }
    >
      <Typography variant="body">{description}</Typography>
    </Dialog>
  );
};
