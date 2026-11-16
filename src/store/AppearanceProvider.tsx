import * as SystemUI from 'expo-system-ui';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance, Platform, useColorScheme as useSystemColorScheme } from 'react-native';

import { palette } from '@/constants/theme';
import { loadAppearance, saveAppearance, type AppearancePreference } from '@/lib/storage';

type AppearanceContextValue = {
  /** What the user picked in Settings. */
  preference: AppearancePreference;
  setPreference: (preference: AppearancePreference) => void;
  /** The scheme actually in effect. */
  scheme: 'light' | 'dark';
  loaded: boolean;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const system = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<AppearancePreference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadAppearance().then((stored) => {
      setPreferenceState(stored);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    // Also override the OS-level scheme on native, so system UI (keyboard, alerts,
    // in-app browser) matches. React Native Web has no equivalent.
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
    }
  }, [preference]);

  const scheme = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  useEffect(() => {
    // Root native view color — shows behind screen transitions and the keyboard.
    SystemUI.setBackgroundColorAsync(palette[scheme].canvas);
  }, [scheme]);

  const value = useMemo<AppearanceContextValue>(
    () => ({
      preference,
      setPreference: (next) => {
        setPreferenceState(next);
        saveAppearance(next);
      },
      scheme,
      loaded,
    }),
    [preference, scheme, loaded],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error('useAppearance must be used inside <AppearanceProvider>');
  return ctx;
}
