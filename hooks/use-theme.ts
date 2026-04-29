import { COLORS } from '@/constants/theme';

export interface Theme {
  colors: typeof COLORS;
  isDark: true;
}

export function useTheme(): Theme {
  return {
    colors: COLORS,
    isDark: true,
  };
}
