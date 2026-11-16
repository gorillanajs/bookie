import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ShareIntentProvider } from 'expo-share-intent';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import '../../global.css';

import { ShareIntentHandler } from '@/components/ShareIntentHandler';
import { ThemeRoot } from '@/components/ThemeRoot';
import { fonts, palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AppearanceProvider, useAppearance } from '@/store/AppearanceProvider';
import { BookmarksProvider, useBookmarks } from '@/store/BookmarksProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on a pushed/modal route keeps a back button present.
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ShareIntentProvider>
      <AppearanceProvider>
        <BookmarksProvider>
          <RootNavigator />
        </BookmarksProvider>
      </AppearanceProvider>
    </ShareIntentProvider>
  );
}

function RootNavigator() {
  const scheme = useColorScheme();
  const { hydrated } = useBookmarks();
  const { loaded: appearanceLoaded } = useAppearance();
  const [fontsLoaded, fontError] = useFonts({
    [fonts.regular]: require('../../assets/fonts/JetBrainsMonoNerdFont-Regular.ttf'),
    [fonts.bold]: require('../../assets/fonts/JetBrainsMonoNerdFont-Bold.ttf'),
  });
  // A font failure shouldn't brick the app — fall back to the system font.
  // Wait for the saved appearance too, so the app doesn't flash the wrong theme.
  const ready = hydrated && appearanceLoaded && (fontsLoaded || !!fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const colors = palette[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.fg,
      background: colors.canvas,
      card: colors.canvas,
      text: colors.fg,
      border: colors.line,
    },
  };

  return (
    <ThemeRoot>
      <ThemeProvider value={theme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: fonts.bold, fontSize: 13 },
            headerBackButtonDisplayMode: 'minimal',
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="collection/[id]" options={{ title: '' }} />
          <Stack.Screen name="add" options={{ presentation: 'modal', title: 'SAVE A PAGE' }} />
          <Stack.Screen
            name="bookmark/[id]"
            options={{ presentation: 'modal', title: 'EDIT PAGE' }}
          />
        </Stack>
        {/* After the Stack so navigation is mounted before a shared page is pushed. */}
        <ShareIntentHandler />
      </ThemeProvider>
    </ThemeRoot>
  );
}
