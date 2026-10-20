import type { ListRowProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './ListRow.module.css';

export const ListRow = ({
  icon,
  title,
  subtitle,
  trailingIcon,
  archived,
  grouped,
  onPress,
}: ListRowProps) => {
  const accessibleLabel = [title, archived ? 'archived' : undefined, subtitle]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`${styles.row} ${archived ? styles.archived : ''} ${grouped ? styles.grouped : ''}`}
    >
      {onPress && (
        <button
          type="button"
          className={styles.overlay}
          onClick={onPress}
          aria-label={accessibleLabel}
        />
      )}
      {icon != null && (
        <span className={styles.iconSlot} aria-hidden={Boolean(onPress)}>
          {typeof icon === 'function' ? icon('currentColor') : icon}
        </span>
      )}
      <span className={styles.body} aria-hidden={Boolean(onPress)}>
        <span className={styles.title}>{title}</span>
        {subtitle && (
          <Typography variant="meta" className={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </span>
      {trailingIcon != null && (
        <span className={styles.trailingIcon} aria-hidden="true" inert>
          {typeof trailingIcon === 'function' ? trailingIcon('currentColor') : trailingIcon}
        </span>
      )}
    </div>
  );
};
