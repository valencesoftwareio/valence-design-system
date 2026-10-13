import {
  copyFileSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const PNG_SIGNATURE = '89504e470d0a1a0a';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 100 * 1024 * 1024;
const MAX_FILES = 3000;
const MAX_DIMENSION = 4096;
const MAX_COMPARISONS = 600;
const MAX_SITE_SIZE = 300 * 1024 * 1024;
const MAX_SITE_FILES = 5000;
const MAX_SITE_COMPARISONS = 1800;
const inputRoot = path.resolve(process.argv[2] ?? 'visual-report-inputs');
const siteRoot = path.resolve(process.argv[3] ?? 'packages/react/storybook-static');
const reportsRoot = path.join(siteRoot, 'visual-reports');
let siteSize = 0;
let siteFiles = 0;
let siteComparisons = 0;

const escapeHtml = (value) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
};

const titleCase = (value) => {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
};

const walk = (directory) => {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed: ${entryPath}`);
    }

    if (entry.isDirectory()) {
      return walk(entryPath);
    }

    if (!entry.isFile()) {
      throw new Error(`Unsupported artifact entry: ${entryPath}`);
    }

    return entryPath;
  });
};

const createReport = (prDirectory) => {
  const prName = path.basename(prDirectory);
  const prMatch = prName.match(/^pr-(\d+)-([a-f0-9]{40})$/);

  if (!prMatch) {
    throw new Error(`Invalid pull request directory: ${prName}`);
  }

  const files = walk(prDirectory);

  if (files.length > MAX_FILES) {
    throw new Error(`${prName} contains too many files.`);
  }

  const comparisons = new Map();
  let totalSize = 0;

  for (const file of files) {
    const relativePath = path.relative(prDirectory, file);
    const stats = lstatSync(file);
    const match = path.basename(file).match(/^(.+)-(light|dark)-(actual|diff|expected)\.png$/);
    const webTarget = path.dirname(relativePath).match(/-(desktop|mobile)-chromium$/)?.[1];
    const nativeTarget = relativePath
      .split(path.sep)
      .find((part) => ['android', 'ios'].includes(part));
    const target = nativeTarget ?? (webTarget ? `web-${webTarget}` : undefined);

    if (!match || !target || stats.size > MAX_FILE_SIZE) {
      throw new Error(`Unexpected visual artifact: ${relativePath}`);
    }

    totalSize += stats.size;

    if (totalSize > MAX_TOTAL_SIZE) {
      throw new Error(`${prName} exceeds the visual artifact size limit.`);
    }

    const image = readFileSync(file);
    const signature = image.subarray(0, 8).toString('hex');
    const width = image.readUInt32BE(16);
    const height = image.readUInt32BE(20);

    if (
      signature !== PNG_SIGNATURE ||
      width === 0 ||
      height === 0 ||
      width > MAX_DIMENSION ||
      height > MAX_DIMENSION
    ) {
      throw new Error(`Invalid PNG file: ${relativePath}`);
    }

    const [, storyId, mode, kind] = match;
    const key = `${storyId}-${mode}-${target}`;
    const comparison = comparisons.get(key) ?? { storyId, mode, target, images: {} };

    if (comparison.images[kind]) {
      throw new Error(`Duplicate ${kind} image for ${key}.`);
    }

    comparison.images[kind] = file;
    comparisons.set(key, comparison);
  }

  const sortedComparisons = [...comparisons.values()].sort((left, right) => {
    return `${left.storyId}-${left.mode}-${left.target}`.localeCompare(
      `${right.storyId}-${right.mode}-${right.target}`,
    );
  });

  if (sortedComparisons.length === 0) {
    throw new Error(`${prName} contains no visual comparisons.`);
  }

  if (sortedComparisons.length > MAX_COMPARISONS) {
    throw new Error(`${prName} contains too many visual comparisons.`);
  }

  if (
    siteSize + totalSize > MAX_SITE_SIZE ||
    siteFiles + files.length > MAX_SITE_FILES ||
    siteComparisons + sortedComparisons.length > MAX_SITE_COMPARISONS
  ) {
    throw new Error(`${prName} exceeds the visual report site limits.`);
  }

  const [, prNumber, commitSha] = prMatch;
  const outputDirectory = path.join(reportsRoot, `pr-${prNumber}`, commitSha);

  mkdirSync(outputDirectory, { recursive: true });

  const cards = sortedComparisons.map((comparison, index) => {
    const missingImage = ['expected', 'actual', 'diff'].find((kind) => !comparison.images[kind]);

    if (missingImage) {
      throw new Error(`${comparison.storyId} is missing its ${missingImage} image.`);
    }

    const imageDirectory = `comparison-${index + 1}`;
    const outputImageDirectory = path.join(outputDirectory, imageDirectory);
    const [componentId, storyId = 'default'] = comparison.storyId.split('--');
    const component = titleCase(componentId.replace(/^components-/, ''));
    const story = titleCase(storyId);

    mkdirSync(outputImageDirectory, { recursive: true });

    for (const kind of ['expected', 'actual', 'diff']) {
      copyFileSync(comparison.images[kind], path.join(outputImageDirectory, `${kind}.png`));
    }

    return `<section class="comparison">
      <header>
        <h2>${escapeHtml(component)} / ${escapeHtml(story)}</h2>
        <span>${escapeHtml(titleCase(comparison.mode))} · ${escapeHtml(titleCase(comparison.target))}</span>
      </header>
      <div class="images">
        ${['expected', 'actual', 'diff']
          .map(
            (kind) => `<figure>
          <figcaption>${escapeHtml(titleCase(kind))}</figcaption>
          <a href="${imageDirectory}/${kind}.png"><img src="${imageDirectory}/${kind}.png" alt="${escapeHtml(`${titleCase(kind)} rendering for ${component} ${story}`)}" loading="lazy"></a>
        </figure>`,
          )
          .join('\n')}
      </div>
    </section>`;
  });
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
    <title>Visual changes for PR #${prNumber}</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { margin: 0 auto; max-width: 1600px; padding: 32px; background: Canvas; color: CanvasText; }
      h1 { margin: 0; font-size: 28px; }
      .summary { margin: 8px 0 32px; color: GrayText; }
      .comparison { margin-bottom: 24px; overflow: hidden; border: 1px solid color-mix(in srgb, CanvasText 25%, transparent); border-radius: 12px; }
      header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px; }
      h2 { margin: 0; font-size: 18px; }
      header span, figcaption { font-size: 14px; font-weight: 600; }
      .images { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid color-mix(in srgb, CanvasText 25%, transparent); }
      figure { margin: 0; padding: 16px; min-width: 0; }
      figure + figure { border-left: 1px solid color-mix(in srgb, CanvasText 25%, transparent); }
      figcaption { margin-bottom: 12px; }
      img { display: block; width: 100%; height: auto; border: 1px solid color-mix(in srgb, CanvasText 20%, transparent); }
      @media (max-width: 800px) {
        body { padding: 16px; }
        header { align-items: flex-start; flex-direction: column; }
        .images { grid-template-columns: 1fr; }
        figure + figure { border-top: 1px solid color-mix(in srgb, CanvasText 25%, transparent); border-left: 0; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Visual changes for PR #${prNumber}</h1>
      <p class="summary">Commit ${commitSha.slice(0, 7)} · ${sortedComparisons.length} ${sortedComparisons.length === 1 ? 'difference' : 'differences'}</p>
      ${cards.join('\n')}
    </main>
  </body>
</html>`;

  writeFileSync(path.join(outputDirectory, 'index.html'), html);
  siteSize += totalSize;
  siteFiles += files.length;
  siteComparisons += sortedComparisons.length;
};

rmSync(reportsRoot, { recursive: true, force: true });
mkdirSync(reportsRoot, { recursive: true });

for (const entry of readdirSync(inputRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    console.error(`Skipping unexpected report input: ${entry.name}`);
    continue;
  }

  try {
    createReport(path.join(inputRoot, entry.name));
  } catch (error) {
    const match = entry.name.match(/^pr-(\d+)-([a-f0-9]{40})$/);

    if (match) {
      rmSync(path.join(reportsRoot, `pr-${match[1]}`, match[2]), {
        recursive: true,
        force: true,
      });
    }

    console.error(`Skipping ${entry.name}: ${error.message}`);
  }
}
