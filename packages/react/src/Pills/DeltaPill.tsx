import type { DeltaPillProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './Pills.module.css';

export const DeltaPill = ({ value, unit = '' }: DeltaPillProps) => {
  const valid = Number.isFinite(value);
  const signedTone = value > 0 ? styles.deltaPositive : styles.deltaNegative;
  const toneClass = valid && value !== 0 ? signedTone : styles.deltaNeutral;

  return (
    <Typography variant="badge" className={`${styles.delta} ${toneClass}`}>
      {valid && value > 0 ? '+' : ''}
      {valid ? value : '—'}
      {unit}
    </Typography>
  );
};
