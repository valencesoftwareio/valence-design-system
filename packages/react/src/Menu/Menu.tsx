import {
  Button as AriaButton,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import type { MenuProps } from '@valencesoftwareio/types';
import { ChevronRightIcon } from 'lucide-react';
import styles from './Menu.module.css';

export const Menu = ({ label, items, disabled, onAction }: MenuProps) => {
  return (
    <MenuTrigger>
      <AriaButton className={styles.trigger} isDisabled={disabled || !onAction}>
        {label}
        <ChevronRightIcon aria-hidden size={14} strokeWidth={1.6} absoluteStrokeWidth />
      </AriaButton>
      <Popover className={styles.popover} placement="bottom end">
        <AriaMenu
          className={styles.menu}
          aria-label={label}
          onAction={(key) => onAction?.(String(key))}
        >
          {items.map((item) => (
            <AriaMenuItem
              id={item.value}
              key={item.value}
              className={`${styles.item} ${item.danger ? styles.danger : ''}`}
              isDisabled={item.disabled}
            >
              {item.icon != null && (
                <span className={styles.icon}>
                  {typeof item.icon === 'function' ? item.icon('currentColor') : item.icon}
                </span>
              )}
              {item.label}
            </AriaMenuItem>
          ))}
        </AriaMenu>
      </Popover>
    </MenuTrigger>
  );
};
