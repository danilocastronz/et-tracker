import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Sighting } from '@/types';
import { getThreatColor, getThreatLabel } from '@/utils/threatLevel';
import { ThemedText } from './ThemedText';

interface SightingListItemProps {
  sighting: Sighting;
}

export function SightingListItem({ sighting }: SightingListItemProps) {
  const threatColor = getThreatColor(sighting.threatLevel);
  const date = new Date(sighting.reportedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable onPress={() => router.push(`/sightings/${sighting.id}`)}>
      <View
        className="flex-row items-center bg-[#1A1A35] mb-2 rounded-xl overflow-hidden"
        style={{ borderLeftWidth: 3, borderLeftColor: threatColor }}
      >
        <View className="flex-1 px-4 py-3">
          <ThemedText weight="medium" size="sm" numberOfLines={1}>
            {sighting.title}
          </ThemedText>
          <View className="flex-row items-center mt-1 gap-2">
            <ThemedText size="xs" style={{ color: threatColor }}>
              {getThreatLabel(sighting.threatLevel)}
            </ThemedText>
            <ThemedText variant="muted" size="xs">· {date}</ThemedText>
          </View>
        </View>
        <View className="pr-4">
          <ThemedText variant="muted" size="lg">›</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}
