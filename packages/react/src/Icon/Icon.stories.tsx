import type { Meta, StoryObj } from '@storybook/react-vite';
import * as icons from '../icons';

type Story = StoryObj<typeof icons.CheckIcon>;

const meta: Meta<typeof icons.CheckIcon> = {
  title: 'Components/Icon',
  component: icons.CheckIcon,
};

export const Default: Story = { args: { size: 64, strokeWidth: 1.6, absoluteStrokeWidth: true } };

export const AllGlyphs: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      {Object.entries(icons).map(([name, Icon]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <Icon aria-hidden size={48} strokeWidth={1.6} absoluteStrokeWidth />
          <div style={{ fontSize: 12, marginTop: 8 }}>{name}</div>
        </div>
      ))}
    </div>
  ),
};

export default meta;
