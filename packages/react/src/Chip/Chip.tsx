import type { ChipProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './Chip.module.css';

export const Chip = ({ selected, disabled, icon, onPress, children }: ChipProps) => {
  const content = (
    <>
      {icon != null && (
        <span className={styles.icon}>
          {typeof icon === 'function' ? icon('currentColor') : icon}
        </span>
      )}
      <Typography variant={onPress ? 'label' : 'badge'}>{children}</Typography>
    </>
  );

  if (!onPress) {
    return <span className={`${styles.chip} ${styles.informational}`}>{content}</span>;
  }

  return (
    <button
      type="button"
      className={`${styles.chip} ${styles.interactive} ${selected ? styles.selected : ''}`}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onPress}
    >
      {content}
    </button>
  );
};
