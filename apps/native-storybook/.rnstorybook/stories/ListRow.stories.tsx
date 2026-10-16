import type { Meta, StoryObj } from '@storybook/react-native';
import { ListRow } from '@valencesoftwareio/react-native';
import { ActivityIcon, ChevronRightIcon, MenuIcon } from '@valencesoftwareio/react-native/icons';

type Story = StoryObj<typeof ListRow>;

const meta: Meta<typeof ListRow> = {
  title: 'Components/ListRow',
  component: ListRow,
};

export const Default: Story = {
  args: {
    icon: (color) => <ActivityIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
    title: 'Pushups',
    subtitle: '40 / day · reminder 07:00',
    trailingIcon: (color) => (
      <ChevronRightIcon size={14} color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
  },
};

export const Reordering: Story = {
  args: {
    icon: (color) => <ActivityIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
    title: 'Pushups',
    subtitle: '40 / day · reminder 07:00',
    trailingIcon: (color) => (
      <MenuIcon size={20} color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
  },
};

export const Archived: Story = {
  args: {
    icon: (color) => <ActivityIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
    title: 'Pushups',
    subtitle: 'Stopped May 9',
    archived: true,
  },
};

export default meta;
