import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomSheet } from './BottomSheet';
import { Button } from '#src/Button/Button';

type Story = StoryObj<typeof BottomSheet>;

const meta: Meta<typeof BottomSheet> = { title: 'Components/BottomSheet', component: BottomSheet };

const BottomSheetExample = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Choose repeat schedule</Button>
      <BottomSheet open={open} title="Repeat" onClose={() => setOpen(false)}>
        Choose which days this goal repeats.
      </BottomSheet>
    </>
  );
};

export const Default: Story = { render: () => <BottomSheetExample /> };

export const Open: Story = { render: () => <BottomSheetExample initiallyOpen /> };

export default meta;
