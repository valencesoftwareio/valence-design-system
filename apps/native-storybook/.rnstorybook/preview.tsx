import type { Preview } from '@storybook/react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker, ThemeProvider } from '@valencesoftwareio/react-native';
import { useValenceFonts } from '@valencesoftwareio/react-native/useValenceFonts';
import { themes, type ThemeMode, type ThemePreset } from '@valencesoftwareio/tokens';
import { useVisualConfig, visualTestEnabled } from './VisualConfig';

const PRESETS: ThemePreset[] = [
  'hi-vis',
  'sea-glass',
  'bauhaus',
  'earthy',
  'tropical',
  'sunset-berry',
  'bodega',
  'indigo-pop',
];
const PRESET_OPTIONS = PRESETS.map((value) => ({ value, label: value }));

interface ValenceDecoratorProps {
  children: React.ReactNode;
  storyId: string;
}

const ValenceDecorator = ({ children, storyId }: ValenceDecoratorProps) => {
  const [fontsLoaded] = useValenceFonts();
  const visualConfig = useVisualConfig();
  const [preset, setPreset] = useState<ThemePreset>('hi-vis');
  const [mode, setMode] = useState<ThemeMode>('light');
  const selectedPreset = visualConfig?.preset ?? preset;
  const selectedMode = visualConfig?.mode ?? mode;
  const theme = themes[selectedPreset][selectedMode];

  if (!fontsLoaded || (visualTestEnabled && !visualConfig)) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider preset={selectedPreset} mode={selectedMode}>
          <View style={{ flex: 1, backgroundColor: theme.colorBackgroundPrimary }}>
            {!visualConfig && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: 8,
                  padding: 8,
                  backgroundColor: theme.colorBackgroundRaised,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colorBorderPrimary,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Picker
                    label="Theme"
                    options={PRESET_OPTIONS}
                    value={preset}
                    onChange={(value) => {
                      const nextPreset = PRESETS.find((option) => option === value);

                      if (nextPreset) {
                        setPreset(nextPreset);
                      }
                    }}
                  />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Color mode: ${mode}. Switch to ${mode === 'light' ? 'dark' : 'light'} mode.`}
                  onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
                  style={{
                    width: theme.controlFieldHeight,
                    height: theme.controlFieldHeight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: theme.colorBorderControl,
                    borderRadius: theme.radiusControl,
                  }}
                >
                  <Text style={{ color: theme.colorTextPrimary, fontSize: 22 }}>
                    {mode === 'light' ? '☀' : '☾'}
                  </Text>
                </Pressable>
              </View>
            )}
            <View testID={`visual-story-${storyId}`} style={{ flex: 1, padding: 16 }}>
              {children}
            </View>
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default {
  decorators: [
    (Story, context) => (
      <ValenceDecorator storyId={context.id}>
        <Story key={context.id} />
      </ValenceDecorator>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
} satisfies Preview;
