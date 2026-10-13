import { registerRootComponent } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { view } from './storybook.requires';
import { visualTestEnabled } from './VisualConfig';

const StorybookUIRoot = view.getStorybookUI({
  onDeviceUI: !visualTestEnabled,
  shouldPersistSelection: !visualTestEnabled,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

registerRootComponent(StorybookUIRoot);
