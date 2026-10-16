import { useId } from 'react';
import * as Select from '@radix-ui/react-select';
import type { PickerProps } from '@valencesoftwareio/types';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { Typography } from '../Typography/Typography';
import styles from './Picker.module.css';

export const Picker = ({
  options,
  value,
  placeholder,
  onChange,
  error,
  disabled,
  helperText,
  label,
}: PickerProps) => {
  const selectId = useId();
  const helperId = useId();

  return (
    <div className={styles.wrap}>
      <label htmlFor={selectId}>
        <Typography variant="label" className={styles.label}>
          {label}
        </Typography>
      </label>
      <Select.Root value={value} disabled={disabled || !onChange} onValueChange={onChange}>
        <Select.Trigger
          id={selectId}
          className={`${styles.trigger} ${error ? styles.error : ''}`}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? helperId : undefined}
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className={styles.chevron}>
            <ChevronRightIcon aria-hidden size={14} strokeWidth={1.6} absoluteStrokeWidth />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content className={styles.content} position="popper" sideOffset={4}>
          <Select.Viewport className={styles.viewport}>
            {options.map((option) => (
              <Select.Item className={styles.item} key={option.value} value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.indicator}>
                  <CheckIcon aria-hidden size={14} strokeWidth={1.6} absoluteStrokeWidth />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
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
