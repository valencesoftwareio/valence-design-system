import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const INDEX_FILE = {
  react: path.join(rootDir, 'packages/react/src/index.ts'),
  reactNative: path.join(rootDir, 'packages/react-native/src/index.ts'),
};
const indexSource = Object.fromEntries(
  Object.entries(INDEX_FILE).map(([platform, file]) => [platform, readFileSync(file, 'utf8')]),
);
const NON_COMPONENT_EXPORTS = new Set([
  'ThemeProvider',
  'useTheme',
  'useValenceFonts',
  'TYPOGRAPHY_VARIANTS',
]);
function getExportedNames(source) {
  const names = new Set();
  const regex = /export\s+(type\s+)?\{([^}]*)\}\s*from/g;
  for (const match of source.matchAll(regex)) {
    if (match[1]) {
      continue;
    }

    for (const raw of match[2].split(',')) {
      const name = raw.trim();

      if (name && !NON_COMPONENT_EXPORTS.has(name)) {
        names.add(name);
      }
    }
  }

  return names;
}

function findFile(directory, fileName) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      const match = findFile(entryPath, fileName);

      if (match) {
        return match;
      }
    } else if (entry.name === fileName) {
      return entryPath;
    }
  }
}

function getStoryNames(file) {
  if (!file) {
    return new Set();
  }

  return new Set(
    [...readFileSync(file, 'utf8').matchAll(/export const (\w+)/g)].map((match) => match[1]),
  );
}

const failures = [];
const exportedNames = Object.fromEntries(
  Object.entries(indexSource).map(([platform, source]) => [platform, getExportedNames(source)]),
);
const componentNames = new Set([...exportedNames.react, ...exportedNames.reactNative]);

for (const name of componentNames) {
  const webTest = findFile(path.join(rootDir, 'packages/react/src'), `${name}.test.tsx`);
  const nativeTest = findFile(path.join(rootDir, 'packages/react-native/src'), `${name}.test.tsx`);
  const webStoryFile = findFile(path.join(rootDir, 'packages/react/src'), `${name}.stories.tsx`);
  const nativeStoryFile = findFile(
    path.join(rootDir, 'apps/native-storybook/.rnstorybook/stories'),
    `${name}.stories.tsx`,
  );

  for (const platform of ['react', 'reactNative']) {
    if (!exportedNames[platform].has(name)) {
      failures.push(`${name}: exported from one platform but not ${platform}`);
    }
  }

  if (!webTest) {
    failures.push(`${name}: react has no platform test`);
  }

  if (!nativeTest) {
    failures.push(`${name}: reactNative has no platform test`);
  }

  if (!webStoryFile) {
    failures.push(`${name}: react has no Storybook story`);
  }

  if (!nativeStoryFile) {
    failures.push(`${name}: reactNative has no Storybook story`);
  }

  const webStories = getStoryNames(webStoryFile);
  const nativeStories = getStoryNames(nativeStoryFile);
  for (const story of new Set([...webStories, ...nativeStories])) {
    if (!webStories.has(story)) {
      failures.push(`${name}: "${story}" story exists on native but not web`);
    }

    if (!nativeStories.has(story)) {
      failures.push(`${name}: "${story}" story exists on web but not native`);
    }
  }
}

if (failures.length > 0) {
  console.error('Parity check failed:\n' + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

console.log(`Parity check passed for ${componentNames.size} components.`);
