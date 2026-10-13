import { useSyncExternalStore, type ReactNode, type CSSProperties } from 'react';
import type { ThemeMode, ThemeOverride, ThemePreset } from '@valencesoftwareio/tokens';

export interface ThemeProviderProps {
  preset?: ThemePreset;
  mode?: ThemeMode;
  theme?: ThemeOverride;
  children: ReactNode;
}

const toCssVars = (theme: ThemeOverride): CSSProperties => {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    vars[`--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`] = String(value);
  }

  return vars as CSSProperties;
};

const subscribeToSystemScheme = (callback: () => void) => {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', callback);

  return () => mql.removeEventListener('change', callback);
};

const getSystemScheme = (): ThemeMode => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ preset = 'hi-vis', mode, theme, children }: ThemeProviderProps) => {
  const systemScheme = useSyncExternalStore(
    subscribeToSystemScheme,
    getSystemScheme,
    () => 'light',
  );
  const resolvedMode = mode ?? systemScheme;

  return (
    <div
      data-preset={preset}
      data-theme={resolvedMode}
      style={{ color: 'var(--color-text-primary)', ...toCssVars(theme ?? {}) }}
    >
      {children}
    </div>
  );
};
