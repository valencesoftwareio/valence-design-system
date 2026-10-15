import type { Meta, StoryObj } from '@storybook/react-native';
import { IconButton } from '@valencesoftwareio/react-native';
import { SlidersHorizontalIcon, XIcon } from '@valencesoftwareio/react-native/icons';

type Story = StoryObj<typeof IconButton>;

const meta: Meta<typeof IconButton> = { title: 'Components/IconButton', component: IconButton };

export const Default: Story = {
  args: {
    label: 'Settings',
    icon: (color) => <SlidersHorizontalIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
    onPress: () => undefined,
  },
};

export const Danger: Story = {
  args: {
    ...Default.args,
    label: 'Delete',
    tone: 'danger',
    icon: (color) => <XIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
  },
};

export const Disabled: Story = { args: { ...Default.args, disabled: true } };

export default meta;
