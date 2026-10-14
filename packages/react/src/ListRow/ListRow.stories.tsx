import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityIcon, ChevronIcon, MenuIcon } from '../icons';
import { ListRow } from './ListRow';

type Story = StoryObj<typeof ListRow>;

const meta: Meta<typeof ListRow> = {
  title: 'Components/ListRow',
  component: ListRow,
};

export const Default: Story = {
  args: {
    icon: (color) => (
      <ActivityIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
    title: 'Pushups',
    subtitle: '40 / day · reminder 07:00',
    trailingIcon: (color) => (
      <ChevronIcon aria-hidden size={14} color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
  },
};

export const Reordering: Story = {
  args: {
    icon: (color) => (
      <ActivityIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
    title: 'Pushups',
    subtitle: '40 / day · reminder 07:00',
    trailingIcon: (color) => (
      <MenuIcon aria-hidden size={20} color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
  },
};

export const Archived: Story = {
  args: {
    icon: (color) => (
      <ActivityIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
    title: 'Pushups',
    subtitle: 'Stopped May 9',
    archived: true,
  },
};

export default meta;
