import { useState } from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Image, Text } from 'react-native';

import { Card } from './Card';
import { DEFAULT_THEME } from '@/ThemeProvider';

const PressableCard = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <Card title="Trip to Tokyo" onPress={() => setPressed(true)} />
      {pressed && <Text>pressed</Text>}
    </>
  );
};

describe('<Card />', () => {
  const user = userEvent.setup();

  it('renders the title', async () => {
    await render(<Card title="Trip to Tokyo" />);

    expect(screen.getByText('Trip to Tokyo')).toBeOnTheScreen();
  });

  it('renders children content', async () => {
    await render(<Card title="Trip to Tokyo">Departs Friday</Card>);

    expect(screen.getByText('Departs Friday')).toBeOnTheScreen();
  });

  it('is not exposed as a button when onPress is not provided', async () => {
    await render(<Card title="Trip to Tokyo" />);

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('exposes a button role named after the title by default', async () => {
    await render(<Card title="Trip to Tokyo" onPress={() => {}} />);

    expect(screen.getByRole('button', { name: 'Trip to Tokyo' })).toBeOnTheScreen();
  });

  it('uses actionLabel as the accessible name when provided', async () => {
    await render(<Card title="Trip to Tokyo" actionLabel="View trip details" onPress={() => {}} />);

    expect(screen.getByRole('button', { name: 'View trip details' })).toBeOnTheScreen();
  });

  it('includes a non-resting status in the default accessible name', async () => {
    await render(<Card title="Trip to Tokyo" status="success" onPress={() => {}} />);

    expect(screen.getByRole('button', { name: 'Trip to Tokyo, success' })).toBeOnTheScreen();
  });

  it('does not add status to an explicit actionLabel', async () => {
    await render(
      <Card
        title="Trip to Tokyo"
        status="success"
        actionLabel="View trip details"
        onPress={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: 'View trip details' })).toBeOnTheScreen();
  });

  it('invokes onPress when pressed', async () => {
    await render(<PressableCard />);

    await user.press(screen.getByRole('button'));

    expect(screen.getByText('pressed')).toBeOnTheScreen();
  });

  it('exposes card content through only the card action', async () => {
    await render(<Card title="Trip to Tokyo" onPress={() => {}} />);

    expect(screen.queryByText('Trip to Tokyo')).not.toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Trip to Tokyo' })).toBeOnTheScreen();
  });

  it('folds plain text children into the default accessible name so they stay reachable', async () => {
    await render(
      <Card title="Trip to Tokyo" onPress={() => {}}>
        Departs Friday
      </Card>,
    );

    expect(screen.getByRole('button', { name: 'Trip to Tokyo, Departs Friday' })).toBeOnTheScreen();
  });

  it('uses the default theme text color for content by default', async () => {
    await render(<Card title="Trip to Tokyo">Departs Friday</Card>);

    expect(screen.getByText('Departs Friday')).toHaveStyle({
      color: DEFAULT_THEME.colorTextPrimary,
    });
  });

  it('uses the on-positive text color for content when status is success', async () => {
    await render(
      <Card title="Trip to Tokyo" status="success">
        Departs Friday
      </Card>,
    );

    expect(screen.getByText('Departs Friday')).toHaveStyle({
      color: DEFAULT_THEME.colorTextOnPositive,
    });
  });

  it('uses the primary text color for content when status is error', async () => {
    await render(
      <Card title="Trip to Tokyo" status="error">
        Departs Friday
      </Card>,
    );

    expect(screen.getByText('Departs Friday')).toHaveStyle({
      color: DEFAULT_THEME.colorTextPrimary,
    });
  });

  it('uses the secondary text color for the title by default', async () => {
    await render(<Card title="Trip to Tokyo" />);

    expect(screen.getByText('Trip to Tokyo')).toHaveStyle({
      color: DEFAULT_THEME.colorTextReadable,
    });
  });

  it('uses the on-positive text color for the title when status is success', async () => {
    await render(<Card title="Trip to Tokyo" status="success" />);

    expect(screen.getByText('Trip to Tokyo')).toHaveStyle({
      color: DEFAULT_THEME.colorTextOnPositive,
    });
  });

  it('uses the secondary text color for the title when status is error', async () => {
    await render(<Card title="Trip to Tokyo" status="error" />);

    expect(screen.getByText('Trip to Tokyo')).toHaveStyle({
      color: DEFAULT_THEME.colorTextReadable,
    });
  });

  it('renders a non-text element child directly instead of wrapping it in Text', async () => {
    await render(
      <Card title="Trip to Tokyo">
        <Image
          accessible
          accessibilityRole="image"
          accessibilityLabel="Tokyo skyline"
          source={{ uri: 'https://example.com/tokyo.jpg' }}
        />
      </Card>,
    );

    expect(screen.getByRole('image', { name: 'Tokyo skyline' })).toBeOnTheScreen();
  });
});
