import { readFileSync, readdirSync } from 'node:fs';
import { URL } from 'node:url';

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
  'tests/visual/web/interactions.spec.ts',
  'tests/visual/web/stories.visual.spec.ts',
];
const sharedDirectories = ['packages/react/.storybook/', 'packages/tokens/', 'packages/types/'];
const sharedNativeDirectories = new Set(['ThemeProvider', 'color', 'foundations', 'hooks']);
const storyDirectory = new URL('../apps/native-storybook/.rnstorybook/stories/', import.meta.url);
const componentNames = new Map(
  readdirSync(storyDirectory)
    .filter((file) => file.endsWith('.stories.tsx'))
    .map((file) => {
      const name = file.replace('.stories.tsx', '');

      return [name.toLowerCase(), name];
    }),
);
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

  const baseline = file.match(/^tests\/visual\/.+\/components-([a-z0-9]+)--.+\.png$/);

  if (baseline) {
    const component = componentNames.get(baseline[1]);

    if (component) {
      components.add(component);
    } else {
      captureAll = true;
      break;
    }

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
