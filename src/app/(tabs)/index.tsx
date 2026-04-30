import { ThreatOverviewSkeleton } from '@/components/ThreatOverviewSkeleton';
import { SightingCardSkeleton } from '@/components/SightingCardSkeleton';
import { Button, Pressable, ScrollView, View } from 'react-native';
import { useSightingsContext } from '@/context/SightingsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RadarAnimation } from '@/components/RadarAnimation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SightingCard } from '@/components/SightingCard';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { getThreatColor } from '@/utils/threatLevel';
import { LOADING_DELAY } from '@/constants/loading';
import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { ThreatLevel } from '@/types';
import { router } from 'expo-router';

const THREAT_LEVELS: ThreatLevel[] = ['low', 'medium', 'high', 'critical'];

export default function HomeScreen() {
  const { sightings } = useSightingsContext();
  const { colors, isDark } = useAppTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DELAY);

    return () => clearTimeout(timer);
  }, []);

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
        <Button
          title="Try!"
          onPress={() => {
            Sentry.captureException(new Error('First error'));
          }}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center px-6 pt-8 pb-6">
            <RadarAnimation size={130} color={isDark ? colors.primary : '#4ADE80'} />
            <View className="flex-row items-center gap-2 mt-4">
              <ThemedText weight="bold" size="2xl">
                ET Tracker
              </ThemedText>
              <MaterialCommunityIcons name="ufo-outline" size={28} color={colors.primary} />
            </View>
            <ThemedText variant="secondary" size="sm" className="mt-1 text-center">
              Monitoring extraterrestrial activity worldwide
            </ThemedText>
          </View>

          {/* Stats Grid */}
          <View className="px-6 mb-6">
            <ThemedText
              weight="semibold"
              size="sm"
              variant="secondary"
              className="mb-3 tracking-widest uppercase"
            >
              Threat Overview
            </ThemedText>
            {isLoading ? (
              <ThreatOverviewSkeleton />
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {THREAT_LEVELS.map((level) => {
                  const color = getThreatColor(level);
                  return (
                    <Pressable
                      key={level}
                      className="flex-1 min-w-[40%] bg-card dark:bg-card-dark rounded-xl p-4 items-center"
                      style={{ borderWidth: 1, borderColor: color }}
                      onPress={() => router.push(`/(tabs)/sightings?view=list&threat=${level}`)}
                    >
                      <ThemedText weight="bold" size="3xl" style={{ color }}>
                        {stats[level]}
                      </ThemedText>
                      <ThemedText variant="secondary" size="xs" className="mt-1 capitalize">
                        {level}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Recent Sightings */}
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <ThemedText
                weight="semibold"
                size="sm"
                variant="secondary"
                className="tracking-widest uppercase"
              >
                Recent Sightings
              </ThemedText>
              <Pressable onPress={() => router.push('/(tabs)/sightings?view=list')}>
                <ThemedText variant="accent" size="sm">
                  View All →
                </ThemedText>
              </Pressable>
            </View>
            {isLoading ? (
              <>
                <SightingCardSkeleton compact />
                <SightingCardSkeleton compact />
                <SightingCardSkeleton compact />
              </>
            ) : (
              recentSightings.map((sighting) => (
                <SightingCard key={sighting.id} sighting={sighting} compact />
              ))
            )}
          </View>

          {/* Report Button */}
          <View className="px-6">
            <Pressable
              onPress={() => router.push('/(modals)/report-sighting')}
              className="flex-row items-center justify-center gap-3 p-4 bg-primary dark:bg-primary-dark rounded-xl"
            >
              <ThemedText weight="bold" size="sm" className="text-white dark:text-black">
                Report New Sighting
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
