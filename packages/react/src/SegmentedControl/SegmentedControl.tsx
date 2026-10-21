import { useId, type CSSProperties } from 'react';
import type { SegmentedControlProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './SegmentedControl.module.css';

export const SegmentedControl = ({
  options,
  value,
  onChange,
  disabled,
  label,
}: SegmentedControlProps) => {
  const name = useId();

  if (options.length === 0) {
    return null;
  }

  const selectedIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div
      className={styles.group}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      role="radiogroup"
      aria-label={label}
      data-disabled={disabled || !onChange || undefined}
    >
      {selectedIndex !== -1 && (
        <div
          className={styles.indicator}
          style={
            {
              width: `calc((100% - 6px) / ${options.length})`,
              '--valence-segment-index': selectedIndex,
            } as CSSProperties
          }
        />
      )}
      {options.map((opt) => (
        <label key={opt.value} className={styles.option}>
          <input
            type="radio"
            className={styles.input}
            name={name}
            checked={opt.value === value}
            disabled={disabled || !onChange}
            onChange={() => onChange?.(opt.value)}
          />
          {opt.icon != null && (
            <span className={styles.icon}>
              {typeof opt.icon === 'function' ? opt.icon('currentColor') : opt.icon}
            </span>
          )}
          <Typography variant="controlLabel">{opt.label}</Typography>
        </label>
      ))}
    </div>
  );
};
