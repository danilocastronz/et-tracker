import { Pressable, View } from 'react-native';
import { Callout } from 'react-native-maps';
import { router } from 'expo-router';
import { Sighting } from '@/types';
import { getThreatColor, getThreatLabel } from '@/utils/threatLevel';
import { ThemedText } from './ThemedText';

interface SightingCalloutProps {
  sighting: Sighting;
}

export function SightingCallout({ sighting }: SightingCalloutProps) {
  const threatColor = getThreatColor(sighting.threatLevel);

  return (
    <Callout tooltip onPress={() => router.push(`/sightings/${sighting.id}`)}>
      <Pressable>
        <View
          style={{
            backgroundColor: '#1A1A35',
            borderRadius: 12,
            padding: 12,
            maxWidth: 220,
            borderWidth: 1,
            borderColor: '#2A2A4A',
          }}
        >
          <ThemedText weight="semibold" size="sm" numberOfLines={2}>
            {sighting.title}
          </ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: threatColor,
              }}
            />
            <ThemedText size="xs" style={{ color: threatColor }}>
              {getThreatLabel(sighting.threatLevel)}
            </ThemedText>
            {sighting.species && (
              <ThemedText variant="muted" size="xs">
                · {sighting.species}
              </ThemedText>
            )}
          </View>
          <ThemedText variant="accent" size="xs" className="mt-2">
            Tap for details →
          </ThemedText>
        </View>
      </Pressable>
    </Callout>
  );
}
