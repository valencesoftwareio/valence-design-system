import { fileURLToPath, URL } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  addons: [],
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: { alias: { '#src': fileURLToPath(new URL('../src', import.meta.url)) } },
    }),
};

export default config;
