import { readFileSync } from 'node:fs';

const changedFiles = readFileSync(0, 'utf8').trim().split('\n').filter(Boolean);
const components = new Set();
const sharedPaths = [
  '.github/workflows/visual-web.yml',
  'apps/native-storybook/.rnstorybook/VisualConfig.ts',
  'apps/native-storybook/.rnstorybook/index.ts',
  'apps/native-storybook/.rnstorybook/main.ts',
  'apps/native-storybook/.rnstorybook/preview.tsx',
  'apps/native-storybook/.rnstorybook/storybook.requires.ts',
  'apps/native-storybook/scripts/generate-visual-flow.mjs',
  'apps/native-storybook/app.json',
  'apps/native-storybook/index.ts',
  'apps/native-storybook/package.json',
  'package.json',
  'packages/react/package.json',
  'packages/react/src/index.css',
  'packages/react-native/package.json',
  'pnpm-lock.yaml',
  'scripts/compare-native-visuals.mjs',
  'scripts/capture-native-visuals.sh',
  'scripts/list-affected-visual-components.mjs',
];
const sharedDirectories = [
  'packages/react/.storybook/',
  'packages/tokens/',
  'packages/types/',
  'tests/visual/',
];
const sharedNativeDirectories = new Set(['ThemeProvider', 'color', 'foundations', 'hooks']);
let captureAll = false;

for (const file of changedFiles) {
  if (
    sharedPaths.includes(file) ||
    sharedDirectories.some((directory) => file.startsWith(directory))
  ) {
    captureAll = true;
    break;
  }

  const nativeStory = file.match(
    /^apps\/native-storybook\/\.rnstorybook\/stories\/([^/]+)\.stories\.tsx$/,
  );

  if (nativeStory) {
    components.add(nativeStory[1]);
    continue;
  }

  const componentSource = file.match(/^packages\/(?:react|react-native)\/src\/([^/]+)\//);

  if (!componentSource) {
    continue;
  }

  const component = componentSource[1];

  if (sharedNativeDirectories.has(component)) {
    captureAll = true;
    break;
  }

  if (component === 'Pills') {
    components.add('DeltaPill');
    components.add('DurationPill');
    components.add('StatusBadge');
    continue;
  }

  if (component !== 'types') {
    components.add(component);
  }
}

process.stdout.write(captureAll ? '*' : [...components].sort().join(','));
