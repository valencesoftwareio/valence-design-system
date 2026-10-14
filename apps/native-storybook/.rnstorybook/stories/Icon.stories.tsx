import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import * as components from '@valencesoftwareio/react-native';

type Story = StoryObj<typeof components.CheckIcon>;

const icons = Object.entries(components).filter(([name]) => name.endsWith('Icon'));
const meta: Meta<typeof components.CheckIcon> = {
  title: 'Components/Icon',
  component: components.CheckIcon,
};

export const Default: Story = { args: { size: 48, strokeWidth: 1.6, absoluteStrokeWidth: true } };

export const AllGlyphs: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
      {icons.map(([name, Icon]) => (
        <View key={name} style={{ alignItems: 'center' }}>
          <Icon size={32} strokeWidth={1.6} absoluteStrokeWidth />
          <components.Typography variant="meta" style={{ marginTop: 6 }}>
            {name}
          </components.Typography>
        </View>
      ))}
    </View>
  ),
};

export default meta;
