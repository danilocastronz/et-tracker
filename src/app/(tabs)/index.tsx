import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadarAnimation } from '@/components';
import { UFOFlyby } from '@/components';
import { SightingCard } from '@/components';
import { ThemedText } from '@/components';
import { ThemedView } from '@/components';
import { useSightingsContext } from '@/context/SightingsContext';
import { useAppTheme } from '@/context/ThemeContext';
import { getThreatColor } from '@/utils/threatLevel';
import { ThreatLevel } from '@/types';

const THREAT_LEVELS: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];

export default function HomeScreen() {
  const { sightings } = useSightingsContext();
  const { colors } = useAppTheme();

  const stats: Record<ThreatLevel, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };
  sightings.forEach((s) => stats[s.threatLevel]++);

  const recentSightings = sightings.slice(0, 3);

  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <UFOFlyby />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center pt-8 pb-6 px-6">
            <RadarAnimation size={160} color={colors.primary} />
            <View className="flex-row items-center gap-2 mt-4">
              <ThemedText weight="bold" size="2xl">ET Tracker</ThemedText>
              <MaterialCommunityIcons name="ufo-outline" size={28} color={colors.primary} />
            </View>
            <ThemedText variant="secondary" size="sm" className="text-center mt-1">
              Monitoring extraterrestrial activity worldwide
            </ThemedText>
          </View>

          {/* Stats Grid */}
          <View className="px-6 mb-6">
            <ThemedText weight="semibold" size="sm" variant="secondary" className="mb-3 uppercase tracking-widest">
              Threat Overview
            </ThemedText>
            <View className="flex-row flex-wrap gap-3">
              {THREAT_LEVELS.map((level) => {
                const color = getThreatColor(level);
                return (
                  <Pressable
                    key={level}
                    className="flex-1 min-w-[40%] rounded-xl p-4 items-center"
                    style={{ backgroundColor: colors.card, borderTopWidth: 2, borderTopColor: color }}
                    onPress={() => router.push(`/(tabs)/sightings?view=list&threat=${level}`)}
                  >
                    <ThemedText weight="bold" size="3xl" style={{ color }}>
                      {stats[level]}
                    </ThemedText>
                    <ThemedText variant="secondary" size="xs" className="capitalize mt-1">
                      {level}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Recent Sightings */}
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <ThemedText weight="semibold" size="sm" variant="secondary" className="uppercase tracking-widest">
                Recent Sightings
              </ThemedText>
              <Pressable onPress={() => router.push('/(tabs)/sightings?view=list')}>
                <ThemedText variant="accent" size="sm">View All →</ThemedText>
              </Pressable>
            </View>
            {recentSightings.map((sighting) => (
              <SightingCard key={sighting.id} sighting={sighting} compact />
            ))}
          </View>

          {/* Report Button */}
          <View className="px-6">
            <Pressable
              onPress={() => router.push('/(modals)/report-sighting')}
              className="rounded-2xl py-4 items-center"
              style={({ pressed }) => ({ backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 })}
            >
              <ThemedText weight="bold" size="base" style={{ color: colors.background }}>
                Report New Sighting
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
