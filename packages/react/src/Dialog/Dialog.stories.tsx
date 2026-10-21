import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/Button';
import { Typography } from '@/Typography';
import { Dialog } from './Dialog';

type Story = StoryObj<typeof Dialog>;

const meta: Meta<typeof Dialog> = { title: 'Components/Dialog', component: Dialog };

const DialogExample = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        title="Account details"
        onClose={() => setOpen(false)}
        actions={<Button onPress={() => setOpen(false)}>Done</Button>}
      >
        <Typography variant="body">Review your account information.</Typography>
      </Dialog>
    </>
  );
};

export const Default: Story = { render: () => <DialogExample /> };

export const Open: Story = { render: () => <DialogExample initiallyOpen /> };

export default meta;
