import type { ToggleProps } from '@valencesoftwareio/types';
import styles from './Toggle.module.css';

export const Toggle = ({
  checked,
  onChange,
  disabled,
  label,
  labelPosition = 'end',
}: ToggleProps) => {
  return (
    <label className={styles.wrap} data-label-position={labelPosition}>
      <input
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        disabled={disabled || !onChange}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span className={styles.text}>{label}</span>
    </label>
  );
};
