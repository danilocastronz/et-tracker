// Theme context using React Native's Appearance API to support light/dark/system modes
// Persists user preference to AsyncStorage and bridges native system theme changes
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { loadPreferences, savePreferences } from '@/lib/preferences';
import { Appearance, useColorScheme } from 'react-native';
import { Colors, getColors } from '@/constants/theme';
import { ColorScheme } from '@/types';

interface ThemeContextValue {
  colors: Colors;
  colorScheme: ColorScheme;
  isDark: boolean;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: getColors('dark'),
  colorScheme: 'system',
  isDark: true,
  setColorScheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setScheme] = useState<ColorScheme>('system');
  const systemColorScheme = useColorScheme() ?? 'dark';
  const mountedRef = useRef(true);

  // Resolve effective scheme: if system, use device preference; otherwise use user choice
  const effectiveScheme = colorScheme === 'system' ? systemColorScheme : colorScheme;
  const isDark = effectiveScheme === 'dark';

  // Load persisted preference on mount
  useEffect(() => {
    mountedRef.current = true;
    loadPreferences().then((prefs) => {
      if (mountedRef.current) setScheme(prefs.colorScheme as ColorScheme);
    });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Update Appearance API when colorScheme changes
  useEffect(() => {
    if (colorScheme === 'system') {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(colorScheme);
    }
  }, [colorScheme]);

  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    setScheme(scheme);
    await savePreferences({ colorScheme: scheme });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors: getColors(effectiveScheme),
        colorScheme,
        isDark,
        setColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
