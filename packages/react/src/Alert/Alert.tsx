import type { AlertProps } from '@valencesoftwareio/types';
import { Typography } from '#src/Typography/Typography';
import styles from './Alert.module.css';

export const Alert = ({ tone = 'info', title, children }: AlertProps) => {
  return (
    <div
      className={`${styles.alert} ${styles[tone]}`}
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      {title && (
        <Typography as="h3" variant="bodyLg">
          {title}
        </Typography>
      )}
      <Typography variant="body">{children}</Typography>
    </div>
  );
};
