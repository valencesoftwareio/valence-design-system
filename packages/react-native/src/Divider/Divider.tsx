import { View } from 'react-native';
import type { DividerProps } from '@valencesoftwareio/types';
import { useTheme } from 'ThemeProvider';

export const Divider = ({ inset = false }: DividerProps) => {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="none"
      style={{
        height: 1,
        marginHorizontal: inset ? 14 : 0,
        backgroundColor: theme.colorBorderDivider,
      }}
    />
  );
};
