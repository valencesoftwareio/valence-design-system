import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const [platform, currentDirectory, baselineDirectory, resultsDirectory, command] =
  process.argv.slice(2);

if (
  !['android', 'ios'].includes(platform) ||
  !currentDirectory ||
  !baselineDirectory ||
  !resultsDirectory
) {
  throw new Error(
    'Usage: compare-native-visuals <android|ios> <current> <baselines> <results> [--update]',
  );
}

const currentRoot = path.resolve(currentDirectory);
const baselineRoot = path.resolve(baselineDirectory);
const resultsRoot = path.resolve(resultsDirectory);
const statusBarHeight = platform === 'android' ? 96 : 186;
const currentFiles = readdirSync(currentRoot)
  .filter((file) => file.endsWith('.png'))
  .sort();

if (currentFiles.length === 0) {
  throw new Error(`No ${platform} screenshots were captured.`);
}

if (command === '--update') {
  rmSync(baselineRoot, { recursive: true, force: true });
  mkdirSync(baselineRoot, { recursive: true });

  for (const file of currentFiles) {
    copyFileSync(path.join(currentRoot, file), path.join(baselineRoot, file));
  }

  process.exit(0);
}

rmSync(resultsRoot, { recursive: true, force: true });
let failed = false;

for (const file of currentFiles) {
  const currentPath = path.join(currentRoot, file);
  const baselinePath = path.join(baselineRoot, file);
  const actual = PNG.sync.read(readFileSync(currentPath));
  let expected;

  try {
    expected = PNG.sync.read(readFileSync(baselinePath));
  } catch {
    failed = true;
    console.error(`Missing ${platform} baseline: ${file}`);
    continue;
  }

  if (actual.width !== expected.width || actual.height !== expected.height) {
    failed = true;
    console.error(`Screenshot dimensions changed: ${file}`);
    continue;
  }

  const difference = new PNG({ width: actual.width, height: actual.height });

  for (let index = 0; index < actual.width * statusBarHeight * 4; index += 1) {
    expected.data[index] = actual.data[index];
  }

  const differentPixels = pixelmatch(
    expected.data,
    actual.data,
    difference.data,
    actual.width,
    actual.height,
    { threshold: 0.1 },
  );

  if (differentPixels === 0) {
    continue;
  }

  failed = true;
  const comparisonDirectory = path.join(resultsRoot, platform);
  const baseName = file.slice(0, -4);

  mkdirSync(comparisonDirectory, { recursive: true });
  copyFileSync(baselinePath, path.join(comparisonDirectory, `${baseName}-expected.png`));
  copyFileSync(currentPath, path.join(comparisonDirectory, `${baseName}-actual.png`));
  writeFileSync(path.join(comparisonDirectory, `${baseName}-diff.png`), PNG.sync.write(difference));
  console.error(`${platform} visual difference: ${file} (${differentPixels} pixels)`);
}

if (failed) {
  process.exitCode = 1;
}
