import { useEffect, useId, useRef } from 'react';
import type { BottomSheetProps } from '@valencesoftwareio/types';
import { Typography } from '#src/Typography/Typography';
import styles from './BottomSheet.module.css';

export const BottomSheet = ({ open, title, onClose, children }: BottomSheetProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.sheet}>
        <div className={styles.handle} aria-hidden="true" />
        <Typography id={titleId} variant="titleSm">
          {title}
        </Typography>
        <div className={styles.content}>{children}</div>
      </div>
    </dialog>
  );
};
