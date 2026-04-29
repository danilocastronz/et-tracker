import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@/global.css';

import { SightingsProvider } from '@/context/SightingsContext';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/hooks/useNotifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppNotifications() {
  useNotifications();
  return null;
}

function ThemedStack() {
  const { isDark, colors } = useAppTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
          headerBackTitle: '',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/report-sighting"
          options={{
            presentation: 'modal',
            title: 'Report Sighting',
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
          }}
        />
        <Stack.Screen name="sightings/[id]" options={{ title: 'Sighting Details' }} />
        <Stack.Screen name="aliens/[species]" options={{ title: 'Species Profile' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Lost in Space' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SightingsProvider>
          <AppNotifications />
          <ThemedStack />
        </SightingsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
