import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { TimePickerValue } from '@valencesoftwareio/types';
import { TimePicker } from './TimePicker';

type Story = StoryObj<typeof TimePicker>;

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
};

const TimePickerPlayground = () => {
  const [value, setValue] = useState<TimePickerValue>('09:30');

  return <TimePicker label="Reminder time" onChange={setValue} value={value} />;
};

export const Default: Story = { args: { label: 'Reminder time', value: '09:30' } };

export const Error: Story = {
  args: {
    error: true,
    helperText: 'Choose a reminder time.',
    label: 'Reminder time',
    value: '09:30',
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Reminder time', value: '09:30' },
};

export const Playground: Story = { render: () => <TimePickerPlayground /> };

export default meta;
