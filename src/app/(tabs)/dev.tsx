import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSightingsContext } from '@/context/SightingsContext';
import { useAppTheme } from '@/context/ThemeContext';
import { SAMPLE_SIGHTINGS } from '@/data/sightings';
import { SIGHTINGS_KEY } from '@/lib/storage';

const DEV_RESET_KEY = 'dev_last_reset';

export default function DevScreen() {
  // Hooks must run unconditionally before any early return
  const { sightings, resetToMockData } = useSightingsContext();
  const { colors } = useAppTheme();
  const [lastReset, setLastReset] = useState<string | null>(null);

  const loadLastReset = useCallback(async () => {
    const reset = await AsyncStorage.getItem(DEV_RESET_KEY);
    setLastReset(reset);
  }, []);

  useEffect(() => {
    loadLastReset();
  }, [loadLastReset]);

  if (!__DEV__) {
    return <Redirect href="/(tabs)" />;
  }

  async function handleResetMockData() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Reset to Mock Data',
      'This will replace all sightings with 20 mock entries. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await resetToMockData();
            const now = new Date().toISOString();
            await AsyncStorage.setItem(DEV_RESET_KEY, now);
            setLastReset(now);
            Alert.alert('Reset Complete', `${SAMPLE_SIGHTINGS.length} mock sightings loaded.`);
          },
        },
      ]
    );
  }

  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <ThemedText weight="bold" size="lg" className="mb-4">
            Developer Tools
          </ThemedText>

          {/* Stats Card */}
          <View className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl p-4 mb-4">
            <ThemedText weight="semibold" size="sm" className="mb-3">
              Storage Stats
            </ThemedText>
            <View className="mb-2">
              <ThemedText variant="secondary" size="xs">
                Sightings Stored: {sightings.length}
              </ThemedText>
            </View>
            <View className="mb-2">
              <ThemedText variant="secondary" size="xs">
                Storage Key: {SIGHTINGS_KEY}
              </ThemedText>
            </View>
            {lastReset && (
              <View>
                <ThemedText variant="secondary" size="xs">
                  Last Reset: {new Date(lastReset).toLocaleString()}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={handleResetMockData}
              className="bg-primary dark:bg-primary-dark rounded-xl p-4 flex-row items-center justify-center gap-3"
            >
              <MaterialIcons name="refresh" size={20} color={colors.background} />
              <ThemedText weight="bold" size="sm" style={{ color: colors.background }}>
                Reset to Mock Data
              </ThemedText>
            </Pressable>
          </View>

          {/* Info Section */}
          <View className="mt-6 gap-3">
            <ThemedText weight="semibold" size="xs" variant="muted" className="uppercase tracking-widest">
              Info
            </ThemedText>
            <View className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-xl p-4">
              <ThemedText variant="secondary" size="sm" className="mb-2">
                This Dev Tools screen is only visible in development mode (__DEV__).
              </ThemedText>
              <ThemedText variant="muted" size="xs">
                Use these tools to quickly test and reset app data during development.
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
