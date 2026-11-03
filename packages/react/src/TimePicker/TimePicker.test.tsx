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

    await user.click(screen.getByLabelText('Increase Minute'));

    expect(screen.getByText('31')).toBeInTheDocument();
  });

  it('changes the period', async () => {
    render(<ControlledTimePicker />);

    await user.click(screen.getByRole('radio', { name: 'PM' }));

    expect(screen.getByRole('radio', { name: 'PM' })).toBeChecked();
  });

  it('exposes error guidance', () => {
    render(
      <TimePicker error helperText="Choose a reminder time." label="Reminder time" value="09:30" />,
    );

    expect(screen.getByText('Choose a reminder time.')).toBeInTheDocument();
  });
});
