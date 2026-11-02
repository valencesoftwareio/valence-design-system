import type { ListRowProps } from '@valencesoftwareio/types';
import { Typography } from '@/Typography';
import styles from './ListRow.module.css';

export const ListRow = ({
  accessibilityLabel,
  icon,
  title,
  titleAccessory,
  subtitle,
  trailingIcon,
  archived,
  grouped,
  onPress,
}: ListRowProps) => {
  const resolvedAccessibilityLabel =
    accessibilityLabel ??
    [title, archived ? 'archived' : undefined, subtitle].filter(Boolean).join(', ');

  return (
    <div
      className={`${styles.row} ${archived ? styles.archived : ''} ${grouped ? styles.grouped : ''}`}
    >
      {onPress && (
        <button
          type="button"
          className={styles.overlay}
          onClick={onPress}
          aria-label={resolvedAccessibilityLabel}
        />
      )}
      {icon != null && (
        <span className={styles.iconSlot} aria-hidden={Boolean(onPress)}>
          {typeof icon === 'function' ? icon('currentColor') : icon}
        </span>
      )}
      <span className={styles.body} aria-hidden={Boolean(onPress)}>
        <span className={styles.titleRow}>
          <span className={styles.title}>{title}</span>
          {titleAccessory && (
            <span className={styles.titleAccessory} inert={Boolean(onPress)}>
              {titleAccessory}
            </span>
          )}
        </span>
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
