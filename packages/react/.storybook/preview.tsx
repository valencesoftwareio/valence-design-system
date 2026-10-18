import type { Preview } from '@storybook/react-vite';
import type { ThemePreset } from '@valencesoftwareio/tokens';
import { ThemeProvider } from '#src/ThemeProvider/ThemeProvider';
import '#src/index.css';
import './preview.css';

const PRESETS: ThemePreset[] = [
  'hi-vis',
  'sea-glass',
  'bauhaus',
  'earthy',
  'tropical',
  'sunset-berry',
  'bodega',
  'indigo-pop',
];
const preview: Preview = {
  globalTypes: {
    preset: {
      description: 'Theme preset',
      toolbar: {
        title: 'Preset',
        icon: 'paintbrush',
        items: PRESETS.map((p) => ({ value: p, title: p })),
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Light/dark mode',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    preset: 'hi-vis',
    mode: 'light',
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <ThemeProvider preset={context.globals.preset} mode={context.globals.mode}>
        <div
          style={{ background: 'var(--color-background-primary)', minHeight: '100vh', padding: 16 }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
