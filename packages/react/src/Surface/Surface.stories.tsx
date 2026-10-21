import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from './Surface';
import { ListRow } from '@/ListRow';
import { Divider } from '@/Divider';
import { Typography } from '@/Typography';

type Story = StoryObj<typeof Surface>;

const meta: Meta<typeof Surface> = { title: 'Components/Surface', component: Surface };

export const Default: Story = {
  render: () => (
    <Surface>
      <div style={{ padding: 14 }}>
        <Typography variant="body">Cloud backup content</Typography>
      </div>
    </Surface>
  ),
};

export const GroupedRows: Story = {
  render: () => (
    <Surface>
      <ListRow grouped title="Cloud backup" subtitle="Back up your progress securely" />
      <Divider inset />
      <ListRow grouped title="Sync now" />
    </Surface>
  ),
};

export default meta;
