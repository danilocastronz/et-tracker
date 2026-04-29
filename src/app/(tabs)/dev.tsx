import { useState, useEffect } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSightingsContext } from '@/context/SightingsContext';
import { SAMPLE_SIGHTINGS } from '@/data/sightings';
import { useAppTheme } from '@/context/ThemeContext';
import { SIGHTINGS_KEY } from '@/lib/storage';

const DEV_RESET_KEY = 'dev_last_reset';

export default function DevScreen() {
  if (!__DEV__) {
    return <Redirect href="/(tabs)" />;
  }

  const { sightings, resetToMockData, clearAllSightings } = useSightingsContext();
  const { colors } = useAppTheme();
  const [lastReset, setLastReset] = useState<string | null>(null);

  useEffect(() => {
    loadLastReset();
  }, []);

  async function loadLastReset() {
    const reset = await AsyncStorage.getItem(DEV_RESET_KEY);
    setLastReset(reset);
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

  async function handleClearAll() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Clear All Sightings',
      'Delete all sightings permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearAllSightings();
            Alert.alert('Cleared', 'All sightings removed.');
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
          <View
            className="rounded-xl p-4 mb-4"
            style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
          >
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
              className="rounded-lg p-4 flex-row items-center justify-between"
              style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="refresh" size={20} color={colors.primary} />
                <View>
                  <ThemedText weight="semibold" size="sm">
                    Reset to Mock Data
                  </ThemedText>
                  <ThemedText variant="secondary" size="xs" className="mt-0.5">
                    Load {SAMPLE_SIGHTINGS.length} sample sightings
                  </ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
            </Pressable>

            <Pressable
              onPress={handleClearAll}
              className="rounded-lg p-4 flex-row items-center justify-between"
              style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons name="delete-sweep" size={20} color="#EF4444" />
                <View>
                  <ThemedText weight="semibold" size="sm" style={{ color: '#EF4444' }}>
                    Clear All Sightings
                  </ThemedText>
                  <ThemedText variant="secondary" size="xs" className="mt-0.5">
                    Delete all stored data
                  </ThemedText>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Info Section */}
          <View className="mt-6 gap-3">
            <ThemedText weight="semibold" size="xs" variant="muted" className="uppercase tracking-widest">
              Info
            </ThemedText>
            <View
              className="rounded-xl p-4"
              style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
            >
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
