// Root layout with font loading, theme setup, and splash screen management
// Fonts are loaded asynchronously; splash screen is hidden once ready to improve perceived performance
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '@/global.css';

import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { SightingsProvider } from '@/context/SightingsContext';
import { useNotifications } from '@/hooks/useNotifications';

// Initialize Sentry for error tracking
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    sendDefaultPii: true,
    enableLogs: true,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
    tracesSampleRate: 0.2, // 20% of transactions
    debug: __DEV__, // Enable debug logs in development
    // Uncomment to enable Spotlight in development
    // spotlight: __DEV__,
  });
  if (__DEV__) {
    console.log('✅ Sentry initialized successfully');
  }
} else if (__DEV__) {
  console.warn('⚠️ Sentry DSN not found. Error tracking disabled.');
}

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppNotifications() {
  useNotifications();
  return null;
}

function ThemedStack() {
  const { isDark, colors } = useAppTheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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

export default Sentry.wrap(function RootLayout() {
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
});
