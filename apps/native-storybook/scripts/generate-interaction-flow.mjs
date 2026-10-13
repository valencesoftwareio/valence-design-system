const [platform] = process.argv.slice(2);

if (!['android', 'ios'].includes(platform)) {
  throw new Error('Usage: generate-interaction-flow <android|ios>');
}

const commands = ['- stopApp'];
let firstLink = true;

const openStory = (storyId) => {
  commands.push(
    `- openLink: valence-storybook://storybook?STORYBOOK_STORY_ID=${storyId}&preset=hi-vis&mode=light`,
  );

  if (platform === 'ios' && firstLink) {
    commands.push(
      '- runFlow:',
      '    when:',
      '      visible: "Open in .*native-storybook.*"',
      '    commands:',
      '      - tapOn:',
      '          text: "^Open$"',
    );
  }

  firstLink = false;
  commands.push(
    '- extendedWaitUntil:',
    '    visible:',
    `      id: visual-story-${storyId}`,
    '    timeout: 30000',
  );
};

openStory('components-dialog--default');
commands.push(
  '- tapOn: "Open dialog"',
  '- assertVisible: "Account details"',
  '- tapOn: "Done"',
  '- assertNotVisible: "Account details"',
);

openStory('components-alertdialog--default');
commands.push(
  '- tapOn: "Open confirmation"',
  '- assertVisible: "Confirm change"',
  '- tapOn: "Cancel"',
  '- assertNotVisible: "Confirm change"',
);

openStory('components-menu--default');
commands.push(
  '- tapOn: "Actions"',
  '- assertVisible: "Edit"',
  '- tapOn: "Archive"',
  '- assertNotVisible: "Delete"',
);

openStory('components-picker--playground');
commands.push('- tapOn: "Frequency"', '- tapOn: "Monthly"', '- assertVisible: "Monthly"');

openStory('components-datepicker--playground');
commands.push(
  '- tapOn: "Due date"',
  '- assertVisible: "Cancel"',
  '- tapOn: "Cancel"',
  '- assertNotVisible: "Cancel"',
);

openStory('components-popover--default');
commands.push(
  '- tapOn: "More information"',
  '- assertVisible: "Additional contextual information."',
  '- tapOn: "Close sheet"',
  '- assertNotVisible: "Additional contextual information."',
);

openStory('components-bottomsheet--default');
commands.push(
  '- tapOn: "Choose repeat schedule"',
  '- assertVisible: "Choose which days this goal repeats."',
  '- tapOn: "Close sheet"',
  '- assertNotVisible: "Choose which days this goal repeats."',
);

process.stdout.write(`appId: io.valencesoftware.storybook\n---\n${commands.join('\n')}\n`);
