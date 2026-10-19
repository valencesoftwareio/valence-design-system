import { useFonts } from 'expo-font';
import geistRegular from '@valencesoftwareio/tokens/fonts/Geist-Regular.ttf';
import geistSemibold from '@valencesoftwareio/tokens/fonts/Geist-SemiBold.ttf';
import geistBold from '@valencesoftwareio/tokens/fonts/Geist-Bold.ttf';
import geistMonoSemibold from '@valencesoftwareio/tokens/fonts/GeistMono-SemiBold.ttf';

export function useValenceFonts() {
  return useFonts({
    'Geist-Regular': geistRegular,
    'Geist-SemiBold': geistSemibold,
    'Geist-Bold': geistBold,
    'GeistMono-SemiBold': geistMonoSemibold,
  });
}
