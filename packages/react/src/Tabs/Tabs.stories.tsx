import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '#src/Typography/Typography';
import { Tabs } from './Tabs';

type Story = StoryObj<typeof Tabs>;

const meta: Meta<typeof Tabs> = { title: 'Components/Tabs', component: Tabs };
const options = [
  {
    value: 'overview',
    label: 'Overview',
    content: <Typography variant="body">Overview content</Typography>,
  },
  {
    value: 'activity',
    label: 'Activity',
    content: <Typography variant="body">Activity content</Typography>,
  },
  {
    value: 'settings',
    label: 'Settings',
    content: <Typography variant="body">Settings content</Typography>,
  },
];

const TabsExample = ({ disabled = false }: { disabled?: boolean }) => {
  const [value, setValue] = useState('overview');
  const displayedOptions = disabled
    ? options.map((option) => ({ ...option, disabled: option.value === 'activity' }))
    : options;

  return (
    <Tabs label="Account sections" options={displayedOptions} value={value} onChange={setValue} />
  );
};

export const Default: Story = { render: () => <TabsExample /> };

export const Disabled: Story = { render: () => <TabsExample disabled /> };

export default meta;
