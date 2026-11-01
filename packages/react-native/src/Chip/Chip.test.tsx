import { useState } from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Chip } from './Chip';
import { DEFAULT_THEME } from '@/ThemeProvider';

const PressableChip = ({ disabled }: { disabled?: boolean }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <Chip onPress={() => setPressed(true)} disabled={disabled}>
        Vegetarian
      </Chip>
      {pressed && <Text>pressed</Text>}
    </>
  );
};

describe('<Chip />', () => {
  const user = userEvent.setup();

  it('renders informational content without button semantics', async () => {
    await render(<Chip>Vegetarian</Chip>);

    expect(screen.getByText('Vegetarian')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('keeps informational content compact', async () => {
    await render(<Chip>Vegetarian</Chip>);

    expect(screen.getByText('Vegetarian').parent).toHaveStyle({
      alignSelf: 'flex-start',
    });
  });

  it('marks the chip as selected', async () => {
    await render(
      <Chip selected onPress={() => undefined}>
        Vegetarian
      </Chip>,
    );

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toBeSelected();
  });

  it('does not mark the chip as selected by default', async () => {
    await render(<Chip onPress={() => undefined}>Vegetarian</Chip>);

    expect(screen.getByRole('button', { name: 'Vegetarian' })).not.toBeSelected();
  });

  it('invokes onPress when pressed', async () => {
    await render(<PressableChip />);

    await user.press(screen.getByRole('button', { name: 'Vegetarian' }));

    expect(screen.getByText('pressed')).toBeOnTheScreen();
  });

  it('does not invoke onPress when disabled', async () => {
    await render(<PressableChip disabled />);

    await user.press(screen.getByRole('button', { name: 'Vegetarian' }));

    expect(screen.queryByText('pressed')).not.toBeOnTheScreen();
  });

  it('marks the chip as disabled', async () => {
    await render(
      <Chip disabled onPress={() => undefined}>
        Vegetarian
      </Chip>,
    );

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toBeDisabled();
  });

  it('renders a visible border when disabled, since its fill alone is too faint to define its shape', async () => {
    await render(
      <Chip disabled onPress={() => undefined}>
        Vegetarian
      </Chip>,
    );

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toHaveStyle({ borderWidth: 1 });
  });

  it('uses the disabled background when selected and disabled', async () => {
    await render(
      <Chip selected disabled onPress={() => undefined}>
        Vegetarian
      </Chip>,
    );

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toHaveStyle({
      backgroundColor: DEFAULT_THEME.colorBackgroundSubtle,
    });
  });

  it('uses a real 48pt minimum touch target', async () => {
    await render(<Chip onPress={() => undefined}>Vegetarian</Chip>);

    expect(screen.getByRole('button', { name: 'Vegetarian' })).toHaveStyle({ minHeight: 48 });
  });

  it('provides the selected foreground color to an icon renderer', async () => {
    await render(
      <Chip
        selected
        onPress={() => undefined}
        icon={(color) => (
          <Text accessibilityLabel="Chip icon" style={{ color }}>
            I
          </Text>
        )}
      >
        Vegetarian
      </Chip>,
    );

    expect(screen.getByLabelText('Chip icon')).toHaveStyle({
      color: DEFAULT_THEME.colorBackgroundPrimary,
    });
  });

  it('provides the primary foreground color to an informational icon renderer', async () => {
    await render(
      <Chip
        icon={(color) => (
          <Text accessibilityLabel="Chip icon" style={{ color }}>
            I
          </Text>
        )}
      >
        Vegetarian
      </Chip>,
    );

    expect(screen.getByLabelText('Chip icon')).toHaveStyle({
      color: DEFAULT_THEME.colorTextPrimary,
    });
  });
});
