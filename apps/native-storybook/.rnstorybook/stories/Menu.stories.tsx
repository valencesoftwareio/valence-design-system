import type { Meta, StoryObj } from '@storybook/react-native';
import { Menu } from '@valencesoftwareio/react-native';
import { PencilIcon } from '@valencesoftwareio/react-native/icons';

type Story = StoryObj<typeof Menu>;

const meta: Meta<typeof Menu> = { title: 'Components/Menu', component: Menu };
const items = [
  {
    value: 'edit',
    label: 'Edit',
    icon: (color: string) => <PencilIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
  },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete', danger: true },
];

export const Default: Story = { args: { label: 'Actions', items, onAction: () => undefined } };

export const Playground: Story = {
  args: { label: 'Actions', items, onAction: () => undefined },
};

export const Disabled: Story = {
  args: { label: 'Actions', items, disabled: true, onAction: () => undefined },
};

export default meta;
