import { useId, type Ref } from 'react';
import type { TextFieldProps } from '@valencesoftwareio/types';
import { SearchIcon } from '../icons';
import { Typography } from '../Typography/Typography';
import styles from './TextField.module.css';

type TextFieldComponentProps = TextFieldProps & { ref?: Ref<HTMLInputElement> };

export const TextField = ({
  variant = 'default',
  value,
  placeholder,
  onChangeText,
  onSubmit,
  inputMode,
  autoComplete,
  secureTextEntry,
  maxLength,
  error,
  disabled,
  helperText,
  label,
  ref,
}: TextFieldComponentProps) => {
  const inputId = useId();
  const helperId = useId();
  const isSearch = variant === 'search';
  let inputType: 'text' | 'search' | 'password' = isSearch ? 'search' : 'text';

  if (secureTextEntry) {
    inputType = 'password';
  }

  return (
    <div className={styles.wrap}>
      <label htmlFor={inputId} className={isSearch ? styles.visuallyHidden : undefined}>
        <Typography variant="label" className={styles.label}>
          {label}
        </Typography>
      </label>
      <div
        className={`${styles.control} ${isSearch ? styles.search : ''} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
      >
        {isSearch && <SearchIcon aria-hidden size={16} strokeWidth={1.6} absoluteStrokeWidth />}
        <input
          ref={ref}
          id={inputId}
          className={styles.field}
          type={inputType}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!onChangeText}
          onChange={(event) => onChangeText?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSubmit?.();
            }
          }}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
        />
      </div>
      {helperText && (
        <Typography
          variant="meta"
          id={helperId}
          className={`${styles.helper} ${error ? styles.helperError : ''}`}
        >
          {helperText}
        </Typography>
      )}
    </div>
  );
};
