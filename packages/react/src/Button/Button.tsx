import type { Ref } from 'react';
import type { ButtonKind, ButtonProps, TypographyVariant } from '@valencesoftwareio/types';
import { Spinner } from '#src/Spinner/Spinner';
import { Typography } from '#src/Typography/Typography';
import styles from './Button.module.css';

const KIND_CLASS: Record<ButtonKind, string> = {
  primary: styles.primary ?? '',
  secondary: styles.secondary ?? '',
  ghost: styles.ghost ?? '',
  danger: styles.danger ?? '',
  dangerConfirm: styles.dangerConfirm ?? '',
  pill: styles.pill ?? '',
};
const TEXT_VARIANT: Record<ButtonKind, TypographyVariant> = {
  primary: 'controlLabel',
  secondary: 'controlLabel',
  ghost: 'controlLabel',
  danger: 'controlLabel',
  dangerConfirm: 'controlLabel',
  pill: 'badge',
};

type ButtonComponentProps = ButtonProps & { ref?: Ref<HTMLButtonElement> };

export const Button = ({
  kind = 'primary',
  disabled,
  loading,
  type = 'button',
  onPress,
  children,
  ref,
}: ButtonComponentProps) => {
  return (
    <button
      ref={ref}
      type={type}
      className={`${styles.base} ${KIND_CLASS[kind] ?? ''}`}
      disabled={disabled || loading || (type === 'button' && !onPress)}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      onClick={onPress}
    >
      <Typography variant={TEXT_VARIANT[kind]} style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </Typography>
      {loading && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner size={14} color="currentColor" />
        </span>
      )}
    </button>
  );
};
