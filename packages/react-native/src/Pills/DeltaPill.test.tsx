import { render, screen } from '@testing-library/react-native';

import { DeltaPill } from './DeltaPill';
import { DEFAULT_THEME } from '#src/ThemeProvider/ThemeProvider';

describe('<DeltaPill />', () => {
  it('renders a positive delta with a plus sign', async () => {
    await render(<DeltaPill value={5} unit="%" />);

    expect(screen.getByText('+5%')).toBeOnTheScreen();
  });

  it('renders a negative delta without a plus sign', async () => {
    await render(<DeltaPill value={-3} unit="%" />);

    expect(screen.getByText('-3%')).toBeOnTheScreen();
  });

  it('renders zero with neutral styling instead of hiding it', async () => {
    await render(<DeltaPill value={0} unit="%" />);

    expect(screen.getByText('0%')).toHaveStyle({ color: DEFAULT_THEME.colorTextPrimary });
  });

  it('renders a placeholder instead of NaN/Infinity for a non-finite value', async () => {
    await render(<DeltaPill value={NaN} unit="%" />);

    expect(screen.getByText('—%')).toHaveStyle({ color: DEFAULT_THEME.colorTextPrimary });
  });
});
