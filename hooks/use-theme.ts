import { useAppTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';

export interface Theme {
  colors: Colors;
  isDark: boolean;
}

export function useTheme(): Theme {
  const { colors, isDark } = useAppTheme();
  return { colors, isDark };
}
