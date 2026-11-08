import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import {
  themes,
  type Theme,
  type ThemeMode,
  type ThemeOverride,
  type ThemePreset,
} from '@valencesoftwareio/tokens';

const DEFAULT_PRESET: ThemePreset = 'hi-vis';

export const DEFAULT_THEME: Theme = themes[DEFAULT_PRESET].light;

export const ThemeContext = createContext<Theme>(DEFAULT_THEME);

export interface ThemeProviderProps {
  preset?: ThemePreset;
  mode?: ThemeMode;
  theme?: ThemeOverride;
  children: ReactNode;
}

export const ThemeProvider = ({
  preset = DEFAULT_PRESET,
  mode,
  theme,
  children,
}: ThemeProviderProps) => {
  const systemScheme = useColorScheme();
  const resolvedMode: ThemeMode = mode ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const value = useMemo(
    () => ({ ...themes[preset][resolvedMode], ...theme }) as Theme,
    [preset, resolvedMode, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};
