import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chip } from './Chip';

const PressableChip = ({ disabled }: { disabled?: boolean }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <Chip onPress={() => setPressed(true)} disabled={disabled}>
        Vegetarian
      </Chip>
      {pressed && <span>pressed</span>}
    </>
  );
};

describe('<Chip />', () => {
  const user = userEvent.setup();

  it('renders informational content without button semantics', () => {
    render(<Chip>Vegetarian</Chip>);

    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('provides the current foreground color to an informational icon renderer', () => {
    render(
      <Chip icon={(color) => <span data-testid="chip-icon" style={{ color }} />}>Vegetarian</Chip>,
    );

    expect(screen.getByTestId('chip-icon')).toHaveStyle({ color: 'var(--color-text-primary)' });
  });

  it('marks the chip as selected', () => {
    render(
      <Chip selected onPress={() => undefined}>
        Vegetarian
      </Chip>,
    );

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('does not mark the chip as selected by default', () => {
    render(<Chip onPress={() => undefined}>Vegetarian</Chip>);

    expect(screen.getByRole('button', { name: 'Vegetarian' })).not.toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('invokes onPress when clicked', async () => {
    render(<PressableChip />);

    await user.click(screen.getByRole('button', { name: 'Vegetarian' }));

    expect(screen.getByText('pressed')).toBeInTheDocument();
  });

  it('does not invoke onPress when disabled', async () => {
    render(<PressableChip disabled />);

    await user.click(screen.getByRole('button', { name: 'Vegetarian' }));

    expect(screen.queryByText('pressed')).not.toBeInTheDocument();
  });

  it('marks the chip as disabled', () => {
    render(
      <Chip disabled onPress={() => undefined}>
        Vegetarian
      </Chip>,
    );

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toBeDisabled();
  });

  it('uses the disabled background when selected and disabled', () => {
    render(
      <Chip selected disabled onPress={() => undefined}>
        Vegetarian
      </Chip>,
    );

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toHaveStyle({
      background: 'var(--color-background-subtle)',
    });
  });
});
