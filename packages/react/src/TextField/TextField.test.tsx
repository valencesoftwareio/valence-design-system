import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextField } from './TextField';

const ControlledTextField = ({ disabled }: { disabled?: boolean }) => {
  const [value, setValue] = useState('');

  return <TextField label="Name" value={value} onChangeText={setValue} disabled={disabled} />;
};

describe('<TextField />', () => {
  const user = userEvent.setup();

  it('renders with an accessible name', () => {
    render(<TextField label="Name" value="" />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('renders the helper text when provided', () => {
    render(<TextField label="Name" value="" helperText="Required" />);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('updates the value as the user types', async () => {
    render(<ControlledTextField />);

    await user.type(screen.getByLabelText('Name'), 'Ada');

    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });

  it('selects its value when focused when requested', async () => {
    render(<TextField label="Name" value="Ada" selectTextOnFocus />);

    const field = screen.getByLabelText('Name');

    await user.click(field);

    expect(field).toHaveFocus();
    expect(field).toHaveProperty('selectionStart', 0);
    expect(field).toHaveProperty('selectionEnd', 3);
  });

  it('does not update the value when disabled', async () => {
    render(<ControlledTextField disabled />);

    await user.type(screen.getByLabelText('Name'), 'Ada');

    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('marks the field as disabled', () => {
    render(<TextField label="Name" value="" disabled />);

    expect(screen.getByLabelText('Name')).toBeDisabled();
  });

  it('marks the field as invalid when in an error state', () => {
    render(<TextField label="Name" value="" error />);

    expect(screen.getByLabelText('Name')).toBeInvalid();
  });

  it('does not mark the field as invalid by default', () => {
    render(<TextField label="Name" value="" />);

    expect(screen.getByLabelText('Name')).not.toBeInvalid();
  });

  it('maps shared input semantics', () => {
    render(
      <TextField
        label="Email"
        value="person@example.com"
        inputMode="email"
        autoComplete="email"
        maxLength={80}
      />,
    );

    const field = screen.getByLabelText('Email');

    expect({
      inputMode: field.getAttribute('inputmode'),
      autoComplete: field.getAttribute('autocomplete'),
      maxLength: field.getAttribute('maxlength'),
    }).toEqual({ inputMode: 'email', autoComplete: 'email', maxLength: '80' });
  });
});
