import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/Button';
import { Toast } from './Toast';

type Story = StoryObj<typeof Toast>;

const meta: Meta<typeof Toast> = { title: 'Components/Toast', component: Toast };

interface ToastExampleProps {
  danger?: boolean;
  initiallyOpen?: boolean;
}

const ToastExample = ({ danger = false, initiallyOpen = false }: ToastExampleProps) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Show toast</Button>
      <Toast
        open={open}
        tone={danger ? 'danger' : 'success'}
        message={danger ? 'Unable to save changes.' : 'Changes saved.'}
        duration={0}
        onDismiss={() => setOpen(false)}
      />
    </>
  );
};

export const Default: Story = { render: () => <ToastExample /> };

export const Danger: Story = { render: () => <ToastExample danger /> };

export const Open: Story = { render: () => <ToastExample initiallyOpen /> };

export const OpenDanger: Story = { render: () => <ToastExample danger initiallyOpen /> };

export default meta;
