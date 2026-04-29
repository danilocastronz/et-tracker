import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@/global.css';

import { SightingsProvider } from '@/context/SightingsContext';
import { useNotifications } from '@/hooks/useNotifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppNotifications() {
  useNotifications();
  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <SightingsProvider>
          <AppNotifications />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#12122A' },
              headerTintColor: '#E8E8FF',
              headerTitleStyle: { fontWeight: '600' },
              contentStyle: { backgroundColor: '#0A0A1A' },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(modals)/report-sighting"
              options={{
                presentation: 'modal',
                title: 'Report Sighting',
                headerStyle: { backgroundColor: '#12122A' },
                headerTintColor: '#E8E8FF',
              }}
            />
            <Stack.Screen
              name="sightings/[id]"
              options={{ title: 'Sighting Details' }}
            />
            <Stack.Screen
              name="aliens/[species]"
              options={{ title: 'Species Profile' }}
            />
            <Stack.Screen name="+not-found" options={{ title: 'Lost in Space' }} />
          </Stack>
          <StatusBar style="light" />
        </SightingsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
