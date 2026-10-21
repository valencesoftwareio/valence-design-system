import type { CardProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './Card.module.css';

const STATUS_CLASS: Record<NonNullable<CardProps['status']>, string> = {
  resting: '',
  editing: styles.editing ?? '',
  success: styles.success ?? '',
  skipped: styles.skipped ?? '',
  error: styles.error ?? '',
};

export const Card = ({ status = 'resting', title, actionLabel, onPress, children }: CardProps) => {
  const describedChildren =
    typeof children === 'string' || typeof children === 'number' ? children : undefined;
  const computedActionLabel =
    actionLabel ??
    [title, status !== 'resting' ? status : undefined, describedChildren]
      .filter(Boolean)
      .join(', ');

  return (
    <div className={`${styles.card} ${STATUS_CLASS[status] ?? ''}`}>
      {onPress && (
        <button
          type="button"
          className={styles.actionOverlay}
          aria-label={computedActionLabel}
          onClick={onPress}
        />
      )}
      <div className={styles.content} inert={Boolean(onPress)}>
        <Typography variant="eyebrow" className={styles.title}>
          {title}
        </Typography>
        {children != null &&
          (describedChildren != null ? (
            <Typography variant="body" className={styles.body}>
              {describedChildren}
            </Typography>
          ) : (
            <div className={styles.body}>{children}</div>
          ))}
      </div>
    </div>
  );
};
