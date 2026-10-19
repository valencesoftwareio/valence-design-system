import { fileURLToPath, URL } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  addons: [],
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        tsconfigPaths: true,
        alias: {
          ThemeProvider: fileURLToPath(new URL('../src/ThemeProvider', import.meta.url)),
          'index.css': fileURLToPath(new URL('../src/index.css', import.meta.url)),
        },
      },
    }),
};

export default config;
