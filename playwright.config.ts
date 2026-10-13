import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual/web',
  outputDir: './test-results/visual-web',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [['line'], ['json', { outputFile: 'test-results/web-results.json' }]],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixels: 0,
      scale: 'css',
      threshold: 0.1,
    },
  },
  snapshotPathTemplate: '{testDir}/baselines/{projectName}/{arg}{ext}',
  use: {
    baseURL: 'http://127.0.0.1:6006',
    colorScheme: 'light',
    locale: 'en-US',
    reducedMotion: 'reduce',
    timezoneId: 'America/New_York',
  },
  webServer: {
    command:
      'pnpm --filter @valencesoftwareio/react exec vite preview --outDir storybook-static --host 127.0.0.1 --port 6006 --strictPort',
    url: 'http://127.0.0.1:6006/index.json',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
  ],
});
