import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  CheckIcon,
  CounterIcon,
  SegmentedControl,
  TimerIcon,
} from '@valencesoftwareio/react-native';

type Story = StoryObj<typeof SegmentedControl>;

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
};
const options = [
  {
    value: 'checkbox',
    label: 'Checkbox',
    icon: (color: string) => <CheckIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
  },
  {
    value: 'time',
    label: 'Timer',
    icon: (color: string) => <TimerIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
  },
  {
    value: 'count',
    label: 'Counter',
    icon: (color: string) => <CounterIcon color={color} strokeWidth={1.6} absoluteStrokeWidth />,
  },
];

const SegmentedControlPlayground = () => {
  const [value, setValue] = useState('time');

  return <SegmentedControl options={options} value={value} onChange={setValue} label="Goal type" />;
};

export const Default: Story = { args: { options, value: 'time', label: 'Goal type' } };

export const Disabled: Story = {
  args: { options, value: 'count', label: 'Goal type', disabled: true },
};

export const Playground: Story = { render: () => <SegmentedControlPlayground /> };

export default meta;
