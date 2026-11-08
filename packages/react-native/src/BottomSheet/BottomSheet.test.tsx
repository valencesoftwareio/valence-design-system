import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { BackHandler } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Typography } from '@/Typography';

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

  it('requests closure when the sheet is dismissed', async () => {
    const onClose = jest.fn();

    await render(
      <BottomSheet open title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    await user.press(screen.getByTestId('bottom-sheet-user-dismiss'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('reopens after a controlled dismissal', async () => {
    const onClose = jest.fn();

    const { rerender } = await render(
      <BottomSheet open title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    await rerender(
      <BottomSheet open={false} title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    await rerender(
      <BottomSheet open title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    expect(await screen.findByText('Schedule')).toBeOnTheScreen();
  });

  it('requests closure on hardware back while open', async () => {
    const onClose = jest.fn();
    const addListener = jest.spyOn(BackHandler, 'addEventListener');

    const pressBack = () =>
      addListener.mock.calls.at(-1)?.[1]({ type: 'hardwareBackPress', timeStamp: 0 });

    await render(
      <BottomSheet open title="Repeat" onClose={onClose}>
        <Typography variant="body">Schedule</Typography>
      </BottomSheet>,
    );

    expect(pressBack()).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
