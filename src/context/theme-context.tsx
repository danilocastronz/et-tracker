// Theme context that follows the system light/dark preference via NativeWind's color scheme hook
import { createContext, useContext } from 'react';
import { useColorScheme } from 'nativewind';
import { Colors, getColors } from '@/constants/theme';

interface ThemeContextValue {
  colors: Colors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: getColors('dark'),
  isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'dark';
  const isDark = scheme === 'dark';

  return (
    <ThemeContext.Provider value={{ colors: getColors(scheme), isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
