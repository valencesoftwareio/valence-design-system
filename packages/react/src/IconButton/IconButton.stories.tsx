import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloseIcon, SettingsIcon } from '../icons';
import { IconButton } from './IconButton';

type Story = StoryObj<typeof IconButton>;

const meta: Meta<typeof IconButton> = { title: 'Components/IconButton', component: IconButton };

export const Default: Story = {
  args: {
    label: 'Settings',
    icon: (color) => (
      <SettingsIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
    onPress: () => undefined,
  },
};

export const Danger: Story = {
  args: {
    ...Default.args,
    label: 'Delete',
    tone: 'danger',
    icon: (color) => <CloseIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />,
  },
};

export const Disabled: Story = { args: { ...Default.args, disabled: true } };

export default meta;
