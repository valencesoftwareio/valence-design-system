import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import type { DialogProps } from '@valencesoftwareio/types';
import { XIcon } from 'lucide-react';
import styles from './Dialog.module.css';

export const Dialog = ({
  open,
  title,
  onClose,
  showCloseButton = true,
  dismissOnOutsidePress = true,
  children,
  actions,
}: DialogProps) => {
  return (
    <ModalOverlay
      className={styles.overlay}
      isDismissable={dismissOnOutsidePress}
      isOpen={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
    >
      <Modal className={styles.modal}>
        <AriaDialog className={styles.dialog}>
          <header className={styles.header}>
            <Heading slot="title" className={styles.title}>
              {title}
            </Heading>
            {showCloseButton && (
              <AriaButton className={styles.close} aria-label="Close" onPress={onClose}>
                <XIcon aria-hidden size={18} strokeWidth={1.6} absoluteStrokeWidth />
              </AriaButton>
            )}
          </header>
          {children != null && <div className={styles.content}>{children}</div>}
          {actions != null && <footer className={styles.actions}>{actions}</footer>}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
};
