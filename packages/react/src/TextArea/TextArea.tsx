import { useId } from 'react';
import type { TextAreaProps } from '@valencesoftwareio/types';
import { Typography } from 'Typography';
import styles from './TextArea.module.css';

export const TextArea = ({
  value,
  placeholder,
  onChangeText,
  maxLength,
  rows = 4,
  required,
  error,
  disabled,
  helperText,
  label,
}: TextAreaProps) => {
  const inputId = useId();
  const helperId = useId();

  return (
    <div className={styles.wrap}>
      <label htmlFor={inputId}>
        <Typography variant="label" className={styles.label}>
          {label}
          {required ? ' *' : ''}
        </Typography>
      </label>
      <textarea
        id={inputId}
        className={`${styles.field} ${error ? styles.error : ''}`}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={Math.max(2, rows)}
        required={required}
        disabled={disabled}
        readOnly={!onChangeText}
        aria-invalid={error || undefined}
        aria-describedby={helperText ? helperId : undefined}
        onChange={(event) => onChangeText?.(event.target.value)}
      />
      {helperText && (
        <Typography
          id={helperId}
          variant="meta"
          className={`${styles.helper} ${error ? styles.helperError : ''}`}
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};
