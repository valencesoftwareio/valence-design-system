import { useState } from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { SegmentedControl } from './SegmentedControl';
import { DEFAULT_THEME } from 'ThemeProvider';

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
];

const ControlledSegmentedControl = ({ disabled }: { disabled?: boolean }) => {
  const [value, setValue] = useState('day');

  return (
    <>
      <SegmentedControl
        label="View"
        options={OPTIONS}
        value={value}
        onChange={setValue}
        disabled={disabled}
      />
      <Text>selected: {value}</Text>
    </>
  );
};

describe('<SegmentedControl />', () => {
  const user = userEvent.setup();

  it('renders each option with an accessible name', async () => {
    await render(<SegmentedControl label="View" options={OPTIONS} value="day" />);

    expect(screen.getByRole('radio', { name: 'Day' })).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeOnTheScreen();
  });

  it('marks the current value as checked', async () => {
    await render(<SegmentedControl label="View" options={OPTIONS} value="week" />);

    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
  });

  it('renders text icons without placing raw text inside a View', async () => {
    await render(
      <SegmentedControl
        label="View"
        options={[{ value: 'day', label: 'Day', icon: '☀' }]}
        value="day"
      />,
    );

    expect(screen.getByText('☀')).toBeOnTheScreen();
  });

  it('provides the muted foreground color to disabled icon renderers', async () => {
    await render(
      <SegmentedControl
        label="View"
        options={[
          {
            value: 'day',
            label: 'Day',
            icon: (color) => (
              <Text accessibilityLabel="Day icon" style={{ color }}>
                I
              </Text>
            ),
          },
        ]}
        value="day"
        disabled
      />,
    );

    expect(screen.getByLabelText('Day icon')).toHaveStyle({
      color: DEFAULT_THEME.colorTextMuted,
    });
  });

  it('invokes onChange with the pressed option value', async () => {
    await render(<ControlledSegmentedControl />);

    await user.press(screen.getByRole('radio', { name: 'Week' }));

    expect(screen.getByText('selected: week')).toBeOnTheScreen();
  });

  it('does not invoke onChange when disabled', async () => {
    await render(<ControlledSegmentedControl disabled />);

    await user.press(screen.getByRole('radio', { name: 'Week' }));

    expect(screen.getByText('selected: day')).toBeOnTheScreen();
  });

  it('marks options as disabled when the control is disabled', async () => {
    await render(<SegmentedControl label="View" options={OPTIONS} value="day" disabled />);

    expect(screen.getByRole('radio', { name: 'Day' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Week' })).toBeDisabled();
  });

  it('marks options as disabled without a change handler', async () => {
    await render(<SegmentedControl label="View" options={OPTIONS} value="day" />);

    expect(screen.getByRole('radio', { name: 'Day' })).toBeDisabled();
  });

  it('renders nothing when options is empty', async () => {
    await render(<SegmentedControl label="View" options={[]} value="day" />);

    expect(screen.queryByRole('radio')).not.toBeOnTheScreen();
  });

  it('marks no option as checked when value matches nothing', async () => {
    await render(<SegmentedControl label="View" options={OPTIONS} value="month" />);

    expect(screen.getByRole('radio', { name: 'Day' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Week' })).not.toBeChecked();
  });
});
