const [platform, scope = '*'] = process.argv.slice(2);

if (!['android', 'ios'].includes(platform)) {
  throw new Error('Usage: generate-interaction-flow <android|ios>');
}

const commands = [];
const components = new Set(scope.split(','));
let firstLink = true;

const includes = (component) => scope === '*' || components.has(component);

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

if (includes('Dialog')) {
  openStory('components-dialog--default');
  commands.push(
    '- tapOn: "Open dialog"',
    '- assertVisible: "Account details"',
    '- tapOn: "Done"',
    '- assertNotVisible: "Account details"',
  );
}

if (includes('AlertDialog')) {
  openStory('components-alertdialog--default');
  commands.push(
    '- tapOn: "Open confirmation"',
    '- assertVisible: "Confirm change"',
    '- tapOn: "Cancel"',
    '- assertNotVisible: "Confirm change"',
  );
}

if (includes('Menu')) {
  openStory('components-menu--default');
  commands.push(
    '- tapOn: "Actions"',
    '- assertVisible: "Edit"',
    '- tapOn: "Archive"',
    '- assertNotVisible: "Delete"',
  );
}

if (includes('Picker')) {
  openStory('components-picker--playground');

  if (platform === 'android') {
    commands.push('- tapOn: "Frequency"', '- tapOn: "Monthly"');
  } else {
    commands.push('- swipe:', '    start: 50%, 29%', '    end: 50%, 22%', '    duration: 400');
  }

  commands.push('- assertVisible: "Monthly"');
}

if (includes('DatePicker')) {
  openStory('components-datepicker--playground');
  commands.push(
    '- tapOn: "Sep 30, 2026"',
    '- assertVisible: "Cancel"',
    '- tapOn: "Cancel"',
    '- assertNotVisible: "Cancel"',
  );
}

if (includes('Popover')) {
  openStory('components-popover--default');
  commands.push(
    '- tapOn:',
    '    id: popover-trigger',
    '- assertVisible: "Additional contextual information."',
    '- tapOn: "Close sheet"',
    '- assertNotVisible: "Additional contextual information."',
  );
}

if (includes('BottomSheet')) {
  openStory('components-bottomsheet--default');
  commands.push(
    '- tapOn: "Choose repeat schedule"',
    '- assertVisible: "Choose which days this goal repeats."',
    '- tapOn: "Close sheet"',
    '- assertNotVisible: "Choose which days this goal repeats."',
  );
}

process.stdout.write(`appId: io.valencesoftware.storybook\n---\n${commands.join('\n')}\n`);
