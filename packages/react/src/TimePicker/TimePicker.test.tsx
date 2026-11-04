import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TimePickerValue } from '@valencesoftwareio/types';
import { TimePicker } from './TimePicker';

const ControlledTimePicker = () => {
  const [value, setValue] = useState<TimePickerValue>('09:30');

  return <TimePicker label="Reminder time" onChange={setValue} value={value} />;
};

describe('<TimePicker />', () => {
  const user = userEvent.setup();

  it('changes the minute', async () => {
    render(<ControlledTimePicker />);

    const minute = screen.getByRole('spinbutton', { name: /minute, Reminder time/ });

    await user.click(minute);

    await user.keyboard('{ArrowUp}');

    expect(minute).toHaveValue(31);
  });

  it('focuses a clicked time segment', async () => {
    render(<ControlledTimePicker />);

    const minute = screen.getByRole('spinbutton', { name: /minute, Reminder time/ });

    await user.click(minute);

    expect(minute).toHaveFocus();
  });

  it('changes the period', async () => {
    render(<ControlledTimePicker />);

    const period = screen.getByRole('spinbutton', { name: /AM\/PM, Reminder time/ });

    await user.click(period);

    await user.keyboard('{ArrowUp}');

    expect(period).toHaveTextContent('PM');
  });

  it('exposes error guidance', () => {
    render(
      <TimePicker error helperText="Choose a reminder time." label="Reminder time" value="09:30" />,
    );

    expect(screen.getByText('Choose a reminder time.')).toBeInTheDocument();
  });
});
