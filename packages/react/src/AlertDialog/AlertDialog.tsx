import { Dialog as AriaDialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import type { AlertDialogProps } from '@valencesoftwareio/types';
import { Button } from '@/Button';
import { Typography } from '@/Typography';
import styles from '@/Dialog/Dialog.module.css';

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
    <ModalOverlay
      className={styles.overlay}
      isOpen={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
    >
      <Modal className={styles.modal}>
        <AriaDialog className={styles.dialog} role="alertdialog">
          <Heading slot="title" className={styles.title}>
            {title}
          </Heading>
          <div className={styles.content}>
            <Typography variant="body">{description}</Typography>
          </div>
          <footer className={styles.actions}>
            <Button kind="secondary" onPress={onClose}>
              {cancelLabel}
            </Button>
            <Button
              kind={danger ? 'dangerConfirm' : 'primary'}
              loading={loading}
              onPress={onConfirm}
            >
              {confirmLabel}
            </Button>
          </footer>
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
};
