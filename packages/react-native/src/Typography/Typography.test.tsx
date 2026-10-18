import { render, screen } from '@testing-library/react-native';

import { Typography } from './Typography';
import { DEFAULT_THEME } from '#src/ThemeProvider/ThemeProvider';

describe('<Typography />', () => {
  it('renders its text content', async () => {
    await render(<Typography variant="body">Hello world</Typography>);

    expect(screen.getByText('Hello world')).toBeOnTheScreen();
  });

  it('renders long content in full', async () => {
    const longText = 'A '.repeat(200).trim();

    await render(<Typography variant="body">{longText}</Typography>);

    expect(screen.getByText(longText)).toBeOnTheScreen();
  });

  it('applies a visibly larger size for display than for meta text', async () => {
    await render(
      <>
        <Typography variant="display">Display</Typography>
        <Typography variant="meta">Meta</Typography>
      </>,
    );

    expect(screen.getByText('Display')).toHaveStyle({ fontSize: DEFAULT_THEME.typeDisplaySize });
    expect(screen.getByText('Meta')).toHaveStyle({ fontSize: DEFAULT_THEME.typeMetaSize });
  });

  it('defaults to the theme text color', async () => {
    await render(<Typography variant="body">Hello world</Typography>);

    expect(screen.getByText('Hello world')).toHaveStyle({
      color: DEFAULT_THEME.colorTextPrimary,
    });
  });

  it('lets an explicit style color override the theme default', async () => {
    await render(
      <Typography variant="body" style={{ color: '#ff0000' }}>
        Hello world
      </Typography>,
    );

    expect(screen.getByText('Hello world')).toHaveStyle({ color: '#ff0000' });
  });

  it('forwards additional accessibility props', async () => {
    await render(
      <Typography variant="body" accessibilityLabel="Custom label">
        Hello world
      </Typography>,
    );

    expect(screen.getByLabelText('Custom label')).toBeOnTheScreen();
  });

  it.each([
    ['display', 'Display'],
    ['title', 'Title'],
    ['titleSm', 'Title sm'],
  ] as [Parameters<typeof Typography>[0]['variant'], string][])(
    '%s defaults to a header',
    async (variant, text) => {
      await render(<Typography variant={variant}>{text}</Typography>);

      expect(screen.getByRole('header', { name: text })).toBeOnTheScreen();
    },
  );

  it('does not default a non-heading variant to accessibilityRole header', async () => {
    await render(<Typography variant="body">Hello world</Typography>);

    expect(screen.queryByRole('header')).not.toBeOnTheScreen();
  });

  it('lets an explicit accessibilityRole override the heading default', async () => {
    await render(
      <Typography variant="title" accessibilityRole="text">
        Section title
      </Typography>,
    );

    expect(screen.queryByRole('header')).not.toBeOnTheScreen();
  });
});
