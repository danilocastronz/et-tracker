import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Sighting } from '@/types';
import { getThreatColor, getThreatLabel } from '@/utils/threatLevel';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface SightingCardProps {
  sighting: Sighting;
  compact?: boolean;
}

export function SightingCard({ sighting, compact = false }: SightingCardProps) {
  const threatColor = getThreatColor(sighting.threatLevel);
  const date = new Date(sighting.reportedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Pressable onPress={() => router.push(`/sightings/${sighting.id}`)}>
      <ThemedView
        variant="card"
        className="rounded-xl overflow-hidden mb-3"
        style={{ borderLeftWidth: 3, borderLeftColor: threatColor }}
      >
        <View className="p-4">
          <View className="flex-row items-start justify-between mb-1">
            <ThemedText
              weight="semibold"
              size="base"
              className="flex-1 mr-2"
              numberOfLines={compact ? 1 : 2}
            >
              {sighting.title}
            </ThemedText>
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: `${threatColor}22` }}
            >
              <ThemedText size="xs" style={{ color: threatColor }}>
                {getThreatLabel(sighting.threatLevel)}
              </ThemedText>
            </View>
          </View>

          {!compact && (
            <ThemedText variant="secondary" size="sm" numberOfLines={2} className="mb-2">
              {sighting.description}
            </ThemedText>
          )}

          <View className="flex-row items-center justify-between">
            <ThemedText variant="muted" size="xs">
              {date}
            </ThemedText>
            {sighting.species && (
              <ThemedText variant="accent" size="xs">
                {sighting.species}
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}
