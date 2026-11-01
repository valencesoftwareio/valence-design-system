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
      <Typography variant="label">{children}</Typography>
    </>
  );
  const className = `${styles.chip} ${selected ? styles.selected : ''}`;

  if (!onPress) {
    return <span className={className}>{content}</span>;
  }

  return (
    <button
      type="button"
      className={`${className} ${styles.interactive}`}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onPress}
    >
      {content}
    </button>
  );
};
