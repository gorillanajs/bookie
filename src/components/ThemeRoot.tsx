import { vars } from 'nativewind';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cssVariables } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

const themes = { light: vars(cssVariables('light')), dark: vars(cssVariables('dark')) };

/** Provides the color-token CSS variables that Tailwind classes like `bg-canvas` resolve against. */
export function ThemeRoot({ children }: { children: ReactNode }) {
  return (
    <View style={themes[useColorScheme()]} className="flex-1 bg-canvas">
      {children}
    </View>
  );
}
