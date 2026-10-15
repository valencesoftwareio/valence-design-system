import { execFileSync } from 'node:child_process';

const [platform] = process.argv.slice(2);

if (!['android', 'ios'].includes(platform)) {
  throw new Error('Usage: generate-visual-flow <android|ios>');
}

const storyIds = execFileSync(process.execPath, ['scripts/list-visual-stories.mjs'], {
  cwd: process.cwd(),
  encoding: 'utf8',
})
  .trim()
  .split('\n');
const openStoryContent = {
  'components-alertdialog--open': 'Confirm change',
  'components-alertdialog--open-danger': 'Confirm change',
  'components-bottomsheet--open': 'Choose which days this goal repeats.',
  'components-dialog--open': 'Account details',
  'components-popover--open': 'Additional contextual information.',
  'components-toast--open': 'Changes saved.',
  'components-toast--open-danger': 'Unable to save changes.',
};
const commands = ['- stopApp'];
let firstLink = true;

for (const storyId of storyIds) {
  for (const mode of ['light', 'dark']) {
    commands.push(
      `- openLink: valence-storybook://storybook?STORYBOOK_STORY_ID=${storyId}&preset=hi-vis&mode=${mode}`,
    );

    if (platform === 'ios' && firstLink) {
      commands.push(
        '- runFlow:',
        '    when:',
        '      visible: "Open in .*native-storybook.*"',
        '    commands:',
        '      - tapOn:',
        '          text: "^Open$"',
        `- openLink: valence-storybook://storybook?STORYBOOK_STORY_ID=${storyId}&preset=hi-vis&mode=${mode}`,
      );
    }

    firstLink = false;

    commands.push(
      '- extendedWaitUntil:',
      '    visible:',
      openStoryContent[storyId]
        ? `      text: "${openStoryContent[storyId]}"`
        : `      id: visual-story-${storyId}`,
      '    timeout: 30000',
    );

    commands.push(
      '- waitForAnimationToEnd:',
      '    timeout: 30000',
      `- takeScreenshot: ${storyId}-${mode}`,
    );
  }
}

process.stdout.write(`appId: io.valencesoftware.storybook\n---\n${commands.join('\n')}\n`);
