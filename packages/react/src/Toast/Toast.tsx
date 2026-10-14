import { useEffect } from 'react';
import type { ToastProps } from '@valencesoftwareio/types';
import { CloseIcon } from '../icons';
import { Typography } from '../Typography/Typography';
import styles from './Toast.module.css';

export const Toast = ({
  open,
  message,
  tone = 'info',
  duration = 5000,
  actionLabel,
  onAction,
  onDismiss,
}: ToastProps) => {
  useEffect(() => {
    if (!open || !onDismiss || duration <= 0) {
      return;
    }

    const timeout = window.setTimeout(onDismiss, duration);

    return () => window.clearTimeout(timeout);
  }, [duration, onDismiss, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`${styles.toast} ${styles[tone]}`}
      role={tone === 'danger' ? 'alert' : 'status'}
      aria-live={tone === 'danger' ? 'assertive' : 'polite'}
    >
      <Typography variant="body">{message}</Typography>
      {actionLabel && onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          <CloseIcon aria-hidden size={16} strokeWidth={1.6} absoluteStrokeWidth />
        </button>
      )}
    </div>
  );
};
