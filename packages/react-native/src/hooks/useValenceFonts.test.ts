import { renderHook } from '@testing-library/react-native';
import { useFonts } from 'expo-font';

import { useValenceFonts } from './useValenceFonts';

jest.mock('expo-font', () => ({
  useFonts: jest.fn(),
}));

jest.mock('@valencesoftwareio/tokens/fonts/Geist-Regular.ttf', () => 1);

jest.mock('@valencesoftwareio/tokens/fonts/Geist-SemiBold.ttf', () => 2);

jest.mock('@valencesoftwareio/tokens/fonts/Geist-Bold.ttf', () => 3);

jest.mock('@valencesoftwareio/tokens/fonts/GeistMono-SemiBold.ttf', () => 4);

describe('useValenceFonts', () => {
  it('returns the font loading result', async () => {
    const error = new Error('font loading failed');

    jest.mocked(useFonts).mockReturnValue([false, error]);

    const { result } = await renderHook(() => useValenceFonts());

    expect(result.current).toEqual([false, error]);
  });
});
