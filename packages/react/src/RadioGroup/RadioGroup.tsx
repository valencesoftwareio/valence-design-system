import { useId } from 'react';
import type { RadioGroupProps } from '@valencesoftwareio/types';
import { Radio } from '@/Radio';
import { Typography } from '@/Typography';
import styles from './RadioGroup.module.css';

export const RadioGroup = ({ options, value, onChange, disabled, label }: RadioGroupProps) => {
  const name = useId();
  const labelId = useId();

  return (
    <div className={styles.wrap}>
      <Typography variant="label" id={labelId} className={styles.label}>
        {label}
      </Typography>
      <div className={styles.group} role="radiogroup" aria-labelledby={labelId}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name={name}
            label={opt.label}
            checked={opt.value === value}
            disabled={disabled || !onChange}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </div>
    </div>
  );
};
