import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { BottomSheet } from './BottomSheet';
import { Typography } from '#src/Typography/Typography';

jest.mock('@gorhom/bottom-sheet');

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 24, right: 0, bottom: 34, left: 0 }),
}));

describe('<BottomSheet />', () => {
  const user = userEvent.setup();

  it('requests closure when the backdrop is pressed', async () => {
    const onClose = jest.fn();

    await render(
      <BottomSheet open title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    await user.press(screen.getByRole('button', { name: 'Close sheet' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('dismisses when the controlled open prop becomes false', async () => {
    const onClose = jest.fn();

    const { rerender } = await render(
      <BottomSheet open title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    await screen.findByText('Schedule');

    await rerender(
      <BottomSheet open={false} title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    await waitFor(() => expect(screen.queryByText('Schedule')).not.toBeOnTheScreen());

    expect(onClose).not.toHaveBeenCalled();
  });
});
