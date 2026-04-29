import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getColors, Colors } from '@/constants/theme';
import { loadPreferences, savePreferences } from '@/lib/preferences';
import { ColorScheme } from '@/types';

interface ThemeContextValue {
  colors: Colors;
  colorScheme: ColorScheme;
  isDark: boolean;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: getColors('dark'),
  colorScheme: 'dark',
  isDark: true,
  setColorScheme: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setScheme] = useState<ColorScheme>('dark');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadPreferences().then((prefs) => {
      if (mountedRef.current) setScheme(prefs.colorScheme);
    });
    return () => { mountedRef.current = false; };
  }, []);

  const setColorScheme = useCallback(async (scheme: ColorScheme) => {
    setScheme(scheme);
    await savePreferences({ colorScheme: scheme });
  }, []);

  return (
    <ThemeContext.Provider value={{
      colors: getColors(colorScheme),
      colorScheme,
      isDark: colorScheme === 'dark',
      setColorScheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
