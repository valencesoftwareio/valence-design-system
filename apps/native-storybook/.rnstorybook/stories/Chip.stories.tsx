import type { Meta, StoryObj } from '@storybook/react-native';
import { Chip } from '@valencesoftwareio/react-native';
import { ActivityIcon } from '@valencesoftwareio/react-native/icons';

type Story = StoryObj<typeof Chip>;

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  args: { onPress: () => undefined },
};

const icon = (color: string) => (
  <ActivityIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />
);

export const Default: Story = { args: { children: 'Pushups', icon } };

export const Selected: Story = { args: { children: 'Pushups', icon, selected: true } };

export const Disabled: Story = { args: { children: 'Pushups', icon, disabled: true } };

export default meta;
