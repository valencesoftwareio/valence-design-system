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
const baselinesRoot = path.resolve(process.argv[4] ?? 'tests/visual');
const galleryRoot = path.join(siteRoot, 'visual-baselines');
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

const validatePng = (file) => {
  const stats = lstatSync(file);

  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`PNG file is too large: ${file}`);
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
    throw new Error(`Invalid PNG file: ${file}`);
  }
};

const createBaselineGallery = () => {
  const targets = [
    { id: 'web-desktop', label: 'Web Desktop', path: 'web/baselines/desktop-chromium' },
    { id: 'web-mobile', label: 'Web Mobile', path: 'web/baselines/mobile-chromium' },
    { id: 'android', label: 'Android', path: 'native/android/baselines' },
    { id: 'ios', label: 'iOS', path: 'native/ios/baselines' },
  ];
  const summaries = [];

  rmSync(galleryRoot, { recursive: true, force: true });
  mkdirSync(galleryRoot, { recursive: true });

  for (const target of targets) {
    const sourceDirectory = path.join(baselinesRoot, target.path);
    const outputDirectory = path.join(galleryRoot, target.id);
    const imageDirectory = path.join(outputDirectory, 'images');
    const stories = walk(sourceDirectory)
      .map((file) => {
        const fileName = path.basename(file);
        const match = fileName.match(/^(.+)-(light|dark)\.png$/);

        if (!match) {
          throw new Error(`Unexpected baseline file: ${file}`);
        }

        validatePng(file);
        mkdirSync(imageDirectory, { recursive: true });
        copyFileSync(file, path.join(imageDirectory, fileName));

        const [, fullStoryId, mode] = match;
        const [componentId, storyId = 'default'] = fullStoryId.split('--');

        return {
          component: titleCase(componentId.replace(/^components-/, '')),
          fileName,
          mode,
          story: titleCase(storyId),
        };
      })
      .sort((left, right) => {
        return `${left.component}-${left.story}-${left.mode}`.localeCompare(
          `${right.component}-${right.story}-${right.mode}`,
        );
      });
    const groups = Map.groupBy(stories, (story) => story.component);
    const navigation = targets
      .map(
        (entry) =>
          `<a href="../${entry.id}/"${entry.id === target.id ? ' aria-current="page"' : ''}>${escapeHtml(entry.label)}</a>`,
      )
      .join('');
    const sections = [...groups]
      .map(([component, componentStories]) => {
        const cards = componentStories
          .map(
            (story) => `<figure>
              <a href="images/${encodeURIComponent(story.fileName)}"><img src="images/${encodeURIComponent(story.fileName)}" alt="${escapeHtml(`${story.component} ${story.story}, ${story.mode} mode`)}" loading="lazy"></a>
              <figcaption><strong>${escapeHtml(story.story)}</strong><span>${escapeHtml(titleCase(story.mode))}</span></figcaption>
            </figure>`,
          )
          .join('\n');

        return `<section>
          <h2>${escapeHtml(component)}</h2>
          <div class="grid">${cards}</div>
        </section>`;
      })
      .join('\n');
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
    <title>${escapeHtml(target.label)} visual baselines</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { margin: 0 auto; max-width: 1600px; padding: 32px; background: Canvas; color: CanvasText; }
      h1 { margin: 0; font-size: 28px; }
      h2 { margin: 32px 0 12px; font-size: 20px; }
      .summary { margin: 8px 0 24px; color: GrayText; }
      nav { display: flex; flex-wrap: wrap; gap: 8px; }
      nav a { padding: 8px 12px; border: 1px solid color-mix(in srgb, CanvasText 25%, transparent); border-radius: 999px; color: inherit; text-decoration: none; }
      nav a[aria-current="page"] { background: CanvasText; color: Canvas; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
      figure { margin: 0; overflow: hidden; border: 1px solid color-mix(in srgb, CanvasText 25%, transparent); border-radius: 12px; }
      figure a { display: block; aspect-ratio: 4 / 3; overflow: auto; background: color-mix(in srgb, CanvasText 5%, Canvas); }
      img { display: block; width: 100%; height: auto; }
      figcaption { display: flex; justify-content: space-between; gap: 12px; padding: 12px; font-size: 14px; }
      figcaption span { color: GrayText; }
      @media (max-width: 600px) { body { padding: 16px; } }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(target.label)} visual baselines</h1>
      <p class="summary">${stories.length} approved screenshots</p>
      <nav aria-label="Baseline platform">${navigation}</nav>
      ${sections}
    </main>
  </body>
</html>`;

    mkdirSync(outputDirectory, { recursive: true });
    writeFileSync(path.join(outputDirectory, 'index.html'), html);
    summaries.push({ ...target, count: stories.length });
  }

  const cards = summaries
    .map(
      (target) => `<a href="${target.id}/">
        <strong>${escapeHtml(target.label)}</strong>
        <span>${target.count} screenshots</span>
      </a>`,
    )
    .join('\n');
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
    <title>Visual baselines</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { margin: 0 auto; max-width: 960px; padding: 32px; background: Canvas; color: CanvasText; }
      h1 { margin: 0; font-size: 28px; }
      p { margin: 8px 0 24px; color: GrayText; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
      a { display: flex; flex-direction: column; gap: 6px; padding: 20px; border: 1px solid color-mix(in srgb, CanvasText 25%, transparent); border-radius: 12px; color: inherit; text-decoration: none; }
      a:hover { border-color: CanvasText; }
      span { color: GrayText; font-size: 14px; }
      @media (max-width: 600px) { body { padding: 16px; } }
    </style>
  </head>
  <body>
    <main>
      <h1>Visual baselines</h1>
      <p>Approved component screenshots used by visual regression checks.</p>
      <div class="grid">${cards}</div>
    </main>
  </body>
</html>`;

  writeFileSync(path.join(galleryRoot, 'index.html'), html);
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

createBaselineGallery();
