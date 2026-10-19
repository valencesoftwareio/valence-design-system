import { render, screen } from '@testing-library/react-native';
import { Surface } from './Surface';
import { Typography } from 'Typography';

describe('<Surface />', () => {
  it('renders arbitrary content without adding interaction semantics', async () => {
    await render(
      <Surface>
        <Typography variant="body">Cloud backup</Typography>
      </Surface>,
    );

    expect(screen.getByText('Cloud backup')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });
});
