# @valencesoftwareio/react-native

This is the React Native half of the Valence design system: a genuinely separate codebase from `@valencesoftwareio/react` that shares the design tokens and the `@valencesoftwareio/types` prop contracts with it. Components use platform-native behavior where it materially improves reliability, while Valence owns their public contracts, theming, and visual treatment.

## Fonts

The real Geist font files live in `@valencesoftwareio/tokens`'s `fonts/` directory, and this package loads them via `expo-font`. Call `useValenceFonts()` from your app's root and don't render your actual UI until loading finishes. If loading fails, report the error and continue with the platform fallback font rather than blocking startup:

```tsx
import { useValenceFonts } from '@valencesoftwareio/react-native/useValenceFonts';

function App() {
  const [fontsLoaded, fontError] = useValenceFonts();
  if (!fontsLoaded && !fontError) return null;
  return <YourApp />;
}
```

Components reference the loaded weights by their exact family name — `Geist-SemiBold`, `Geist-Bold`, `GeistMono-SemiBold`, and so on — through the registry in `fonts.ts`, because React Native selects between static font files by family name rather than resolving a `fontWeight` value against a single variable font the way CSS does. If you add a component that needs a weight not already in that registry, add it there rather than writing the family-name string inline; that registry is meant to be the one place those strings live.

## App root

`BottomSheet` uses Gorhom's native sheet implementation. Install the package's native peers and mount their providers once at the app root:

```tsx
import 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <YourApp />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

## Sizing and touch targets

Every interactive control in this package enforces a real minimum touch target, sized to comfortably clear the larger of the two major mobile platforms' own recommended minimums, so a single value works safely as a floor on both iOS and Android. That value, along with a handful of other native-specific control dimensions like field height and the slider handle size, is authored as a token the same way color and spacing are — the source to change if any of them ever need adjusting.

## Reduced motion

The package uses one internal reduced-motion hook to subscribe to React Native's `AccessibilityInfo` setting. It is an implementation detail rather than public API; components use it to skip nonessential animation and press-scale feedback consistently.
