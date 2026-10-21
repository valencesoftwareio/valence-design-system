import type { NumberFieldProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './NumberField.module.css';

export const NumberField = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
  error,
  label,
}: NumberFieldProps) => {
  const safeMin = min != null && Number.isFinite(min) ? min : -Infinity;
  const safeMax = max != null && Number.isFinite(max) ? max : Infinity;
  const rangeInvalid =
    (min != null && !Number.isFinite(min)) ||
    (max != null && !Number.isFinite(max)) ||
    safeMin > safeMax;
  const finiteMaxFallback = Number.isFinite(safeMax) ? safeMax : 0;
  const fallbackValue = Number.isFinite(safeMin) ? safeMin : finiteMaxFallback;
  const boundedValue = rangeInvalid ? value : Math.min(safeMax, Math.max(safeMin, value));
  const safeValue = Number.isFinite(value) ? boundedValue : fallbackValue;
  const atMin = safeValue <= safeMin;
  const atMax = safeValue >= safeMax;
  const effectiveStep = Math.abs(step);
  const stepInvalid = !Number.isFinite(effectiveStep) || effectiveStep === 0;

  return (
    <div className={styles.wrap}>
      <Typography variant="label" className={styles.label}>
        {label}
      </Typography>
      <div
        className={`${styles.control} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
      >
        <button
          type="button"
          className={styles.sideBtn}
          disabled={disabled || rangeInvalid || atMin || stepInvalid || !onChange}
          aria-label={`Decrease ${label}`}
          onClick={() => onChange?.(Math.max(safeMin, safeValue - effectiveStep))}
        >
          <Typography variant="numeral">−</Typography>
        </button>
        <Typography variant="numeral" className={styles.value}>
          {safeValue}
        </Typography>
        <button
          type="button"
          className={styles.sideBtn}
          disabled={disabled || rangeInvalid || atMax || stepInvalid || !onChange}
          aria-label={`Increase ${label}`}
          onClick={() => onChange?.(Math.min(safeMax, safeValue + effectiveStep))}
        >
          <Typography variant="numeral">+</Typography>
        </button>
      </div>
    </div>
  );
};
