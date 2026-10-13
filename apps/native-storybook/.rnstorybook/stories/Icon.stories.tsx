import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ICON_NAMES } from '@valencesoftwareio/types';
import { Icon, Typography } from '@valencesoftwareio/react-native';

type Story = StoryObj<typeof Icon>;

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: { name: { control: 'select', options: ICON_NAMES } },
};

export const Default: Story = { args: { name: 'check', size: 48 } };

export const AllGlyphs: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
      {ICON_NAMES.map((name) => (
        <View key={name} style={{ alignItems: 'center' }}>
          <Icon name={name} size={32} />
          <Typography variant="meta" style={{ marginTop: 6 }}>
            {name}
          </Typography>
        </View>
      ))}
    </View>
  ),
};

export default meta;
