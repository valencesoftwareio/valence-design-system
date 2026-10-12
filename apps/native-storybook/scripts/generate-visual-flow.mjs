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
const commands = [];

for (const storyId of storyIds) {
  commands.push('- stopApp');

  for (const mode of ['light', 'dark']) {
    commands.push(
      `- openLink: valence-storybook://storybook?STORYBOOK_STORY_ID=${storyId}&preset=hi-vis&mode=${mode}`,
    );

    if (platform === 'ios') {
      commands.push(
        '- runFlow:',
        '    when:',
        '      visible: "Open in .*native-storybook.*"',
        '    commands:',
        '      - tapOn:',
        '          text: "^Open$"',
      );
    }

    if (!storyId.endsWith('--open')) {
      commands.push(
        '- extendedWaitUntil:',
        '    visible:',
        '      id: visual-story-content',
        '    timeout: 30000',
      );
    }

    commands.push(
      '- waitForAnimationToEnd:',
      '    timeout: 30000',
      `- takeScreenshot: ${storyId}-${mode}`,
    );
  }
}

process.stdout.write(`appId: io.valencesoftware.storybook\n---\n${commands.join('\n')}\n`);
