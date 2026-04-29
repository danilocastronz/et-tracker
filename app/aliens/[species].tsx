import { Pressable, ScrollView, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SightingCard } from '@/components/SightingCard';
import { SAMPLE_ALIENS } from '@/data/aliens';
import { useSightingsContext } from '@/context/SightingsContext';
import { getThreatColor, getThreatEmoji, getThreatLabel } from '@/utils/threatLevel';

const categoryEmoji: Record<string, string> = {
  friendly: '🟢',
  hostile: '🔴',
  unknown: '🟡',
};

export default function SpeciesDetailScreen() {
  const { species: slug } = useLocalSearchParams<{ species: string }>();
  const { sightings } = useSightingsContext();

  const species = SAMPLE_ALIENS.find((a) => a.slug === slug);
  const relatedSightings = sightings.filter((s) => s.species === slug).slice(0, 3);

  if (!species) {
    return (
      <ThemedView variant="background" className="flex-1 items-center justify-center">
        <ThemedText size="4xl" className="mb-3">🔭</ThemedText>
        <ThemedText weight="bold" size="lg">Species not found</ThemedText>
        <Pressable onPress={() => router.back()} className="mt-4">
          <ThemedText variant="accent">← Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const threatColor = getThreatColor(species.threatLevel);

  return (
    <ThemedView variant="background" className="flex-1">
      <Stack.Screen options={{ title: species.name }} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          className="px-5 pt-6 pb-6"
          style={{ borderBottomWidth: 1, borderBottomColor: '#2A2A4A' }}
        >
          <View className="flex-row items-start justify-between mb-3">
            <ThemedText weight="bold" size="3xl" className="flex-1 mr-3">
              {species.name}
            </ThemedText>
            <View className="items-end gap-2">
              <View
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: `${threatColor}22` }}
              >
                <ThemedText size="sm" style={{ color: threatColor }}>
                  {getThreatEmoji(species.threatLevel)} {getThreatLabel(species.threatLevel)}
                </ThemedText>
              </View>
              <ThemedText size="sm">
                {categoryEmoji[species.category]} {species.category}
              </ThemedText>
            </View>
          </View>

          <View className="bg-[#1A1A35] rounded-xl px-4 py-2 self-start mb-4">
            <ThemedText variant="muted" size="xs">ORIGIN</ThemedText>
            <ThemedText weight="medium" size="sm">{species.origin}</ThemedText>
          </View>

          <ThemedText variant="secondary" size="base" className="leading-relaxed">
            {species.description}
          </ThemedText>
        </View>

        {/* Traits */}
        <View className="px-5 pt-5 pb-4">
          <ThemedText weight="semibold" size="sm" variant="secondary" className="uppercase tracking-widest mb-3">
            Known Traits
          </ThemedText>
          <View className="gap-2">
            {species.traits.map((trait, i) => (
              <View key={i} className="flex-row items-start gap-3">
                <View
                  className="w-1.5 h-1.5 rounded-full mt-2"
                  style={{ backgroundColor: threatColor }}
                />
                <ThemedText variant="secondary" size="sm" className="flex-1">
                  {trait}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* First sighted */}
        <View className="mx-5 bg-[#1A1A35] rounded-xl px-4 py-3 mb-5">
          <ThemedText variant="muted" size="xs" className="mb-1">FIRST DOCUMENTED SIGHTING</ThemedText>
          <ThemedText weight="medium" size="sm">
            {species.firstSighted.length > 12
              ? species.firstSighted
              : new Date(species.firstSighted).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
          </ThemedText>
        </View>

        {/* Related sightings */}
        {relatedSightings.length > 0 && (
          <View className="px-5">
            <ThemedText weight="semibold" size="sm" variant="secondary" className="uppercase tracking-widest mb-3">
              Related Sightings
            </ThemedText>
            {relatedSightings.map((s) => (
              <SightingCard key={s.id} sighting={s} compact />
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
