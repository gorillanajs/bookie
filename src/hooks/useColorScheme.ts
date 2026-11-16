import { useAppearance } from '@/store/AppearanceProvider';

/** The color scheme in effect: the user's choice in Settings, or the system's. */
export function useColorScheme(): 'light' | 'dark' {
  return useAppearance().scheme;
}
