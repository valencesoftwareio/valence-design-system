import { View } from 'react-native';
import type { SurfaceProps } from '@valencesoftwareio/types';
import { useTheme } from '#src/ThemeProvider/ThemeProvider';

export const Surface = ({ children }: SurfaceProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: theme.colorBackgroundRaised,
        borderRadius: theme.radiusLg,
        boxShadow: theme.shadowSurface,
      }}
    >
      {children}
    </View>
  );
};
