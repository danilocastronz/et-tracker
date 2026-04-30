// Theme context that follows the system light/dark preference via React Native's Appearance API
import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
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
  const systemColorScheme = useColorScheme() ?? 'dark';
  const isDark = systemColorScheme === 'dark';

  return (
    <ThemeContext.Provider value={{ colors: getColors(systemColorScheme), isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
