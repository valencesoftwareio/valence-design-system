import type { StepButtonProps } from '@valencesoftwareio/types';
import { Typography } from '#src/Typography/Typography';
import styles from './StepButton.module.css';

const TONE_CLASS: Record<StepButtonProps['tone'], string> = {
  positive: styles.positive ?? '',
  negative: styles.negative ?? '',
};

export const StepButton = ({ label, tone, disabled, onPress }: StepButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.base} ${TONE_CLASS[tone] ?? ''}`}
      disabled={disabled || !onPress}
      onClick={onPress}
    >
      <Typography variant="badge">{label}</Typography>
    </button>
  );
};
