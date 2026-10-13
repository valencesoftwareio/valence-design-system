import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { themes, type ThemeMode, type ThemePreset } from '@valencesoftwareio/tokens';

export interface VisualConfig {
  mode: ThemeMode;
  preset: ThemePreset;
}

export const visualTestEnabled = process.env.EXPO_PUBLIC_VISUAL_TEST === 'true';

const isThemePreset = (value: string | null): value is ThemePreset => {
  return value !== null && value in themes;
};

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'light' || value === 'dark';
};

const parseVisualConfig = (url: string | null): VisualConfig | undefined => {
  if (!visualTestEnabled || !url) {
    return undefined;
  }

  const parsedUrl = new URL(url);
  const preset = parsedUrl.searchParams.get('preset');
  const mode = parsedUrl.searchParams.get('mode');

  if (!isThemePreset(preset) || !isThemeMode(mode)) {
    return undefined;
  }

  return { preset, mode };
};

export const useVisualConfig = () => {
  const [config, setConfig] = useState<VisualConfig>();

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      setConfig(parseVisualConfig(url));
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      setConfig(parseVisualConfig(url));
    });

    return subscription.remove;
  }, []);

  return config;
};
