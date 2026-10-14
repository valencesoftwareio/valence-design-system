import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SettingsIcon } from '../icons';
import { Typography } from '../Typography/Typography';
import { Popover } from './Popover';

type Story = StoryObj<typeof Popover>;

const meta: Meta<typeof Popover> = { title: 'Components/Popover', component: Popover };

const PopoverExample = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <Popover
      open={open}
      label="More information"
      trigger={<SettingsIcon aria-hidden strokeWidth={1.6} absoluteStrokeWidth />}
      onOpenChange={setOpen}
    >
      <Typography variant="body">Additional contextual information.</Typography>
    </Popover>
  );
};

export const Default: Story = { render: () => <PopoverExample /> };

export const Open: Story = { render: () => <PopoverExample initiallyOpen /> };

export default meta;
