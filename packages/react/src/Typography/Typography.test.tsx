import { render, screen } from '@testing-library/react';

import { Typography } from './Typography';

describe('<Typography />', () => {
  it('renders its text content', () => {
    render(<Typography variant="body">Hello world</Typography>);

    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders long content in full', () => {
    const longText = 'A '.repeat(200).trim();
    render(<Typography variant="body">{longText}</Typography>);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('forwards additional attributes', () => {
    render(
      <Typography variant="body" aria-label="Custom label">
        Hello world
      </Typography>,
    );

    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });

  it.each([
    ['display', 1, 'Display'],
    ['title', 2, 'Title'],
    ['titleSm', 3, 'Title sm'],
  ] as [Parameters<typeof Typography>[0]['variant'], number, string][])(
    '%s defaults to a level %s heading',
    (variant, level, text) => {
      render(<Typography variant={variant}>{text}</Typography>);

      expect(screen.getByRole('heading', { level, name: text })).toBeInTheDocument();
    },
  );

  it('lets as override the default heading level', () => {
    render(
      <Typography variant="titleSm" as="h1">
        Compact page title
      </Typography>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Compact page title' }),
    ).toBeInTheDocument();
  });

  it('does not expose mono text as a heading', () => {
    render(<Typography variant="mono">NTCH-1234</Typography>);

    expect(screen.getByText('NTCH-1234')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
