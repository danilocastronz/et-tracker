import { getThreatColor, getThreatLabel } from '@/utils/threat-level';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { formatDate } from '@/utils/format-date';
import { capitalize } from '@/utils/capitalize';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Sighting } from '@/types';

interface SightingCardProps {
  sighting: Sighting;
  compact?: boolean;
}

export function SightingCard({ sighting, compact = false }: SightingCardProps) {
  const threatColor = getThreatColor(sighting.threatLevel);
  const date = formatDate(sighting.reportedAt);

  return (
    <Pressable onPress={() => router.push(`/sightings/${sighting.id}`)}>
      <ThemedView
        variant="card"
        className="mb-3 overflow-hidden rounded-xl"
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
                {capitalize(sighting.species)}
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}
