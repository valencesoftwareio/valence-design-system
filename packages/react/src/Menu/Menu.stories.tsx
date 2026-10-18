import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { PencilIcon } from 'lucide-react';
import { Menu } from './Menu';

type Story = StoryObj<typeof Menu>;

const meta: Meta<typeof Menu> = { title: 'Components/Menu', component: Menu };
const items = [
  {
    value: 'edit',
    label: 'Edit',
    icon: (color: string) => (
      <PencilIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
  },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete', danger: true },
];

export const Default: Story = {
  args: { label: 'Actions', items, onAction: () => undefined },
};

export const Playground: Story = {
  args: { label: 'Actions', items, onAction: () => undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }));
  },
};

export const Disabled: Story = {
  args: { label: 'Actions', items, disabled: true, onAction: () => undefined },
};

export default meta;
