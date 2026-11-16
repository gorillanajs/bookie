import { palette, type ThemeColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useTheme(): ThemeColors {
  return palette[useColorScheme()];
}
