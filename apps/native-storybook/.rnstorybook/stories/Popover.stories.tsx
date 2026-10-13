import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Icon, Popover, Typography } from '@valencesoftwareio/react-native';

type Story = StoryObj<typeof Popover>;

const meta: Meta<typeof Popover> = { title: 'Components/Popover', component: Popover };

const PopoverExample = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <Popover
      open={open}
      label="More information"
      trigger={
        <View testID="popover-trigger">
          <Icon name="settings" />
        </View>
      }
      onOpenChange={setOpen}
    >
      <Typography variant="body">Additional contextual information.</Typography>
    </Popover>
  );
};

export const Default: Story = { render: () => <PopoverExample /> };

export const Open: Story = { render: () => <PopoverExample initiallyOpen /> };

export default meta;
