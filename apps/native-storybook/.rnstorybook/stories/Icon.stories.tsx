import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Typography } from '@valencesoftwareio/react-native';
import {
  ActivityIcon,
  CalendarIcon,
  CheckIcon,
  SearchIcon,
  SettingsIcon,
  type LucideIcon,
} from '@valencesoftwareio/react-native/icons';

type Story = StoryObj<typeof CheckIcon>;

const icons: [string, LucideIcon][] = [
  ['Activity', ActivityIcon],
  ['Calendar', CalendarIcon],
  ['Check', CheckIcon],
  ['Search', SearchIcon],
  ['Settings', SettingsIcon],
];
const meta: Meta<typeof CheckIcon> = {
  title: 'Components/Icon',
  component: CheckIcon,
};

export const Default: Story = { args: { size: 48, strokeWidth: 1.6, absoluteStrokeWidth: true } };

export const AllGlyphs: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
      {icons.map(([name, Icon]) => (
        <View key={name} style={{ alignItems: 'center' }}>
          <Icon size={32} strokeWidth={1.6} absoluteStrokeWidth />
          <Typography variant="meta" style={{ marginTop: 6 }}>
            {name}
          </Typography>
        </View>
      ))}
    </View>
  ),
};

export default meta;
