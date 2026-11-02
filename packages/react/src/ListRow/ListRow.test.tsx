import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Chip } from '@/Chip';
import { ListRow } from './ListRow';

const PressableListRow = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <ListRow title="Groceries" onPress={() => setPressed(true)} />
      {pressed && <span>pressed</span>}
    </>
  );
};

describe('<ListRow />', () => {
  const user = userEvent.setup();

  it('renders the title', () => {
    render(<ListRow title="Groceries" />);

    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<ListRow title="Groceries" subtitle="Due Friday" />);

    expect(screen.getByText('Due Friday')).toBeInTheDocument();
  });

  it('renders a title accessory', () => {
    render(<ListRow title="Groceries" titleAccessory={<Chip>Weekly</Chip>} />);

    expect(screen.getByText('Weekly')).toBeInTheDocument();
  });

  it('is not a button when onPress is not provided', () => {
    render(<ListRow title="Groceries" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes a pressable button when onPress is provided', () => {
    render(<ListRow title="Groceries" onPress={() => {}} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('invokes onPress when pressed', async () => {
    render(<PressableListRow />);

    await user.click(screen.getByRole('button'));

    expect(screen.getByText('pressed')).toBeInTheDocument();
  });

  it('shows the title with strikethrough when archived', () => {
    render(<ListRow title="Groceries" archived />);

    expect(screen.getByText('Groceries')).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('includes archived state in the accessible name when pressable', () => {
    render(<ListRow title="Groceries" subtitle="Due Friday" archived onPress={() => {}} />);

    expect(
      screen.getByRole('button', { name: 'Groceries, archived, Due Friday' }),
    ).toBeInTheDocument();
  });

  it('uses a provided accessible name when pressable', () => {
    render(
      <ListRow
        accessibilityLabel="Groceries, Weekly, Due Friday"
        onPress={() => {}}
        title="Groceries"
        titleAccessory={<Chip>Weekly</Chip>}
        subtitle="Due Friday"
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Groceries, Weekly, Due Friday' }),
    ).toBeInTheDocument();
  });

  it('exposes only the row action when the title accessory is interactive', () => {
    render(
      <ListRow
        onPress={() => {}}
        title="Groceries"
        titleAccessory={<button type="button">Nested action</button>}
      />,
    );

    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('does not strike through the title when not archived', () => {
    render(<ListRow title="Groceries" />);

    expect(screen.getByText('Groceries')).not.toHaveStyle({ textDecoration: 'line-through' });
  });

  it('hides the trailing icon from assistive technology', () => {
    render(
      <ListRow
        title="Groceries"
        trailingIcon={() => <svg role="img" aria-label="Decorative icon" />}
      />,
    );

    expect(screen.queryByRole('img', { name: 'Decorative icon' })).not.toBeInTheDocument();
  });
});
