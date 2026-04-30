import { getThreatColor, getThreatLabel } from '@/utils/threatLevel';
import { ThemedText } from '@/components/ThemedText';
import { formatDate } from '@/utils/formatDate';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Sighting } from '@/types';

interface SightingListItemProps {
  sighting: Sighting;
}

export function SightingListItem({ sighting }: SightingListItemProps) {
  const threatColor = getThreatColor(sighting.threatLevel);

  return (
    <Pressable onPress={() => router.push(`/sightings/${sighting.id}`)}>
      <View
        className="flex-row items-center bg-card dark:bg-card-dark mb-2 rounded-xl overflow-hidden"
        style={{ borderLeftWidth: 3, borderLeftColor: threatColor }}
      >
        <View className="flex-1 px-4 py-3">
          <ThemedText weight="medium" size="sm" numberOfLines={1}>
            {sighting.title}
          </ThemedText>
          <View className="flex-row items-center gap-2 mt-1">
            <ThemedText size="xs" style={{ color: threatColor }}>
              {getThreatLabel(sighting.threatLevel)}
            </ThemedText>
            <ThemedText variant="muted" size="xs">
              · {formatDate(sighting.reportedAt)}
            </ThemedText>
          </View>
        </View>
        <View className="pr-4">
          <ThemedText variant="muted" size="lg">
            ›
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}
