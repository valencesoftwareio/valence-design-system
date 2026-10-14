import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon, CounterIcon, TimerIcon } from '../icons';
import { SegmentedControl } from './SegmentedControl';

type Story = StoryObj<typeof SegmentedControl>;

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
};
const options = [
  {
    value: 'checkbox',
    label: 'Checkbox',
    icon: (color: string) => (
      <CheckIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
  },
  {
    value: 'time',
    label: 'Timer',
    icon: (color: string) => (
      <TimerIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
  },
  {
    value: 'count',
    label: 'Counter',
    icon: (color: string) => (
      <CounterIcon aria-hidden color={color} strokeWidth={1.6} absoluteStrokeWidth />
    ),
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
