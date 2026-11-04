import { useState } from 'react';
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';
import type { TimePickerValue } from '@valencesoftwareio/types';
import { TimePicker } from './TimePicker';

const ControlledTimePicker = () => {
  const [value, setValue] = useState<TimePickerValue>('09:30');

  return <TimePicker label="Reminder time" onChange={setValue} value={value} />;
};

describe('<TimePicker />', () => {
  const user = userEvent.setup();

  it('accepts a minute', async () => {
    await render(<ControlledTimePicker />);

    await fireEvent(screen.getByLabelText('Minute'), 'changeText', '45');

    expect(screen.getByLabelText('Minute')).toHaveDisplayValue('45');
  });

  it('changes the period', async () => {
    await render(<ControlledTimePicker />);

    await user.press(screen.getByRole('button', { name: 'AM, switch to PM' }));

    expect(screen.getByRole('button', { name: 'PM, switch to AM' })).toBeOnTheScreen();
  });

  it('preserves an edited minute when the period changes', async () => {
    await render(<ControlledTimePicker />);

    await fireEvent(screen.getByLabelText('Minute'), 'changeText', '45');

    await user.press(screen.getByRole('button', { name: 'AM, switch to PM' }));

    expect(screen.getByLabelText('Minute')).toHaveDisplayValue('45');
  });

  it('exposes error guidance', async () => {
    await render(
      <TimePicker error helperText="Choose a reminder time." label="Reminder time" value="09:30" />,
    );

    expect(screen.getByText('Choose a reminder time.')).toBeOnTheScreen();
  });

  it('hides the visible label when the surrounding view provides context', async () => {
    await render(<TimePicker hideLabel label="Reminder time" value="09:30" />);

    expect(screen.queryByText('Reminder time')).not.toBeOnTheScreen();
  });
});
