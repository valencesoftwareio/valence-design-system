import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

type StoryIndexEntry = {
  id: string;
  name: string;
  tags?: string[];
  title: string;
  type: string;
};

type StoryIndex = {
  entries: Record<string, StoryIndexEntry>;
};

const STORY_INDEX_PATH = 'packages/react/storybook-static/index.json';
const MODES: ('light' | 'dark')[] = ['light', 'dark'];
const requestedComponents = process.env.VISUAL_COMPONENTS?.split(',').filter(Boolean);
const storyIndex = JSON.parse(readFileSync(STORY_INDEX_PATH, 'utf8')) as StoryIndex;
const stories = Object.values(storyIndex.entries).filter(
  (entry) =>
    entry.type === 'story' &&
    !entry.tags?.includes('visual-skip') &&
    (requestedComponents?.[0] === '*' ||
      !requestedComponents ||
      requestedComponents.includes(entry.title.split('/').at(-1) ?? '')),
);

for (const story of stories) {
  test.describe(story.title, () => {
    for (const mode of MODES) {
      test(`${story.name} · ${mode}`, async ({ page }) => {
        const globals = `preset:hi-vis;mode:${mode}`;
        const url = `/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&globals=${encodeURIComponent(globals)}`;

        await page.emulateMedia({ colorScheme: mode });

        await page.goto(url);

        await page.evaluate(async () => document.fonts.ready);

        const renderedStory = page.locator('#storybook-root > *').first();

        await renderedStory.waitFor({ state: 'attached' });

        await expect(page).toHaveScreenshot(`${story.id}-${mode}.png`);
      });
    }
  });
}
