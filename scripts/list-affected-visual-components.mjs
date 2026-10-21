import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { URL } from 'node:url';
import ts from 'typescript';

const [platform] = process.argv.slice(2);

if (!['web', 'android', 'ios'].includes(platform)) {
  throw new Error('Usage: list-affected-visual-components <web|android|ios>');
}

const changedFiles = readFileSync(0, 'utf8').trim().split('\n').filter(Boolean);
const components = new Set();
const sharedPaths = [
  '.github/workflows/visual-web.yml',
  'package.json',
  'pnpm-lock.yaml',
  'scripts/list-affected-visual-components.mjs',
];
const webPaths = [
  'packages/react/package.json',
  'packages/react/src/index.css',
  'playwright.config.ts',
];
const nativePaths = [
  'packages/react-native/package.json',
  'scripts/capture-native-visuals.sh',
  'scripts/compare-native-visuals.mjs',
  'scripts/test-native-interactions.sh',
];
const sharedDirectories = ['packages/tokens/', 'packages/types/'];
const sharedComponentDirectories = new Set(['ThemeProvider', 'color', 'foundations', 'hooks']);
const storyDirectory = new URL('../apps/native-storybook/.rnstorybook/stories/', import.meta.url);
const componentNames = new Map(
  readdirSync(storyDirectory)
    .filter((file) => file.endsWith('.stories.tsx'))
    .map((file) => {
      const name = file.replace('.stories.tsx', '');

      return [name.toLowerCase(), name];
    }),
);
const sourcePackage = platform === 'web' ? 'react' : 'react-native';
const rootDirectory = new URL('../', import.meta.url).pathname;
const sourceDirectory = join(rootDirectory, 'packages', sourcePackage, 'src');
const baselineDirectory = platform === 'web' ? 'web' : `native/${platform}`;
const baselinePattern = new RegExp(
  `^tests/visual/${baselineDirectory}/.+/components-([a-z0-9]+)--.+\\.png$`,
);
let captureAll = false;

function listTypeScriptFiles(directory, includeStories = false) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return listTypeScriptFiles(path, includeStories);
    }

    return /\.tsx?$/.test(entry.name) &&
      !entry.name.endsWith('.test.tsx') &&
      (includeStories || !entry.name.endsWith('.stories.tsx'))
      ? [path]
      : [];
  });
}

function componentForSourceFile(file) {
  const [component] = relative(sourceDirectory, file).split(sep);

  return componentNames.get(component.toLowerCase());
}

function componentForStoryFile(file) {
  if (platform === 'web') {
    return componentForSourceFile(file);
  }

  return componentNames.get(file.split(sep).at(-1).replace('.stories.tsx', '').toLowerCase());
}

function resolveImport(importer, specifier) {
  if (!specifier.startsWith('.')) {
    return undefined;
  }

  return ts.resolveModuleName(specifier, importer, {}, ts.sys).resolvedModule?.resolvedFileName;
}

function importedComponents(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    false,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const imports = new Set();

  source.forEachChild((node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const specifier = node.moduleSpecifier.text;
      const imported = resolveImport(file, specifier);
      const component = imported ? componentForSourceFile(imported) : undefined;

      if (component) {
        imports.add(component);
      }

      if (
        platform !== 'web' &&
        specifier === '@valencesoftwareio/react-native' &&
        ts.isImportDeclaration(node) &&
        node.importClause?.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings)
      ) {
        for (const element of node.importClause.namedBindings.elements) {
          const importedComponent = componentNames.get(
            (element.propertyName?.text ?? element.name.text).toLowerCase(),
          );

          if (importedComponent) {
            imports.add(importedComponent);
          }
        }
      }
    }
  });

  return imports;
}

function componentDependents() {
  const dependents = new Map();
  const sourceFiles = listTypeScriptFiles(sourceDirectory);
  const storyFiles =
    platform === 'web'
      ? listTypeScriptFiles(sourceDirectory, true).filter((file) => file.endsWith('.stories.tsx'))
      : readdirSync(storyDirectory)
          .filter((file) => file.endsWith('.stories.tsx'))
          .map((file) => join(storyDirectory.pathname, file));

  for (const file of [...sourceFiles, ...storyFiles]) {
    const consumer = file.endsWith('.stories.tsx')
      ? componentForStoryFile(file)
      : componentForSourceFile(file);

    if (!consumer) {
      continue;
    }

    for (const dependency of importedComponents(file)) {
      if (!dependency || dependency === consumer) {
        continue;
      }

      const consumers = dependents.get(dependency) ?? new Set();

      consumers.add(consumer);
      dependents.set(dependency, consumers);
    }
  }

  return dependents;
}

function includeDependents() {
  const dependents = componentDependents();
  const queue = [...components];

  for (const component of queue) {
    for (const dependent of dependents.get(component) ?? []) {
      if (!components.has(dependent)) {
        components.add(dependent);
        queue.push(dependent);
      }
    }
  }
}

for (const file of changedFiles) {
  const baseline = file.match(baselinePattern);

  if (baseline) {
    const component = componentNames.get(baseline[1]);

    if (component) {
      components.add(component);
    } else {
      captureAll = true;
    }

    continue;
  }

  const nativeStory = file.match(
    /^apps\/native-storybook\/\.rnstorybook\/stories\/([^/]+)\.stories\.tsx$/,
  );

  if (nativeStory) {
    components.add(nativeStory[1]);
    continue;
  }

  if (sharedPaths.includes(file) || sharedDirectories.some((path) => file.startsWith(path))) {
    captureAll = true;
    continue;
  }

  if (platform === 'web') {
    if (
      webPaths.includes(file) ||
      file.startsWith('packages/react/.storybook/') ||
      file.startsWith('tests/visual/web/')
    ) {
      captureAll = true;
    }
  } else if (
    nativePaths.includes(file) ||
    file.startsWith('apps/native-storybook/') ||
    file.startsWith(`tests/visual/native/${platform}/`)
  ) {
    captureAll = true;
  }

  const componentSource = file.match(/^packages\/(react|react-native)\/src\/([^/]+)\//);

  if (!componentSource) {
    continue;
  }

  const component = componentSource[2];

  if (sharedComponentDirectories.has(component)) {
    captureAll = true;
    continue;
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

if (!captureAll) {
  includeDependents();
}

process.stdout.write(captureAll ? '*' : [...components].sort().join(','));
