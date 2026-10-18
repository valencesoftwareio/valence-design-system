import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '#src/Button/Button';
import { AlertDialog } from './AlertDialog';

type Story = StoryObj<typeof AlertDialog>;

const meta: Meta<typeof AlertDialog> = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
};

interface AlertDialogExampleProps {
  danger?: boolean;
  initiallyOpen?: boolean;
}

const AlertDialogExample = ({ danger = false, initiallyOpen = false }: AlertDialogExampleProps) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <>
      <Button kind={danger ? 'danger' : 'primary'} onPress={() => setOpen(true)}>
        Open confirmation
      </Button>
      <AlertDialog
        open={open}
        title="Confirm change"
        description="This action cannot be undone."
        confirmLabel="Continue"
        cancelLabel="Cancel"
        danger={danger}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
};

export const Default: Story = { render: () => <AlertDialogExample /> };

export const Danger: Story = { render: () => <AlertDialogExample danger /> };

export const Open: Story = { render: () => <AlertDialogExample initiallyOpen /> };

export const OpenDanger: Story = {
  render: () => <AlertDialogExample danger initiallyOpen />,
};

export default meta;
