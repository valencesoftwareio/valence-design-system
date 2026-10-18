import type { ChipProps } from '@valencesoftwareio/types';
import { Typography } from '#src/Typography/Typography';
import styles from './Chip.module.css';

export const Chip = ({ selected, disabled, icon, onPress, children }: ChipProps) => {
  return (
    <button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      disabled={disabled || !onPress}
      aria-pressed={selected}
      onClick={onPress}
    >
      {icon != null && (
        <span className={styles.icon}>
          {typeof icon === 'function' ? icon('currentColor') : icon}
        </span>
      )}
      <Typography variant="label">{children}</Typography>
    </button>
  );
};
