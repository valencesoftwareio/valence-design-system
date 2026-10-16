import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ActivityIcon,
  CalendarIcon,
  CheckIcon,
  SearchIcon,
  SettingsIcon,
  type LucideIcon,
} from 'lucide-react';

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

export const Default: Story = { args: { size: 64, strokeWidth: 1.6, absoluteStrokeWidth: true } };

export const AllGlyphs: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      {icons.map(([name, Icon]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <Icon aria-hidden size={48} strokeWidth={1.6} absoluteStrokeWidth />
          <div style={{ fontSize: 12, marginTop: 8 }}>{name}</div>
        </div>
      ))}
    </div>
  ),
};

export default meta;
