import { getThreatColor, getThreatLabel } from '@/utils/threatLevel';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { capitalize } from '@/utils/capitalize';
import { Pressable, View } from 'react-native';
import { AlienSpecies } from '@/types';
import { router } from 'expo-router';
import { Image } from 'expo-image';

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight.trim()) {
    return <ThemedText weight="semibold">{text}</ThemedText>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <ThemedText weight="semibold">
      {parts.map((part, i) =>
        regex.test(part) ? (
          <ThemedText key={i} weight="semibold" variant="accent">
            {part}
          </ThemedText>
        ) : (
          part
        )
      )}
    </ThemedText>
  );
}

const categoryBadgeColor: Record<string, string> = {
  friendly: '#22C55E22',
  hostile: '#EF444422',
  unknown: '#F59E0B22',
};

const categoryTextColor: Record<string, string> = {
  friendly: '#22C55E',
  hostile: '#EF4444',
  unknown: '#F59E0B',
};

interface AlienCardProps {
  species: AlienSpecies;
  searchQuery?: string;
}

export function AlienCard({ species, searchQuery = '' }: AlienCardProps) {
  const threatColor = getThreatColor(species.threatLevel);

  return (
    <Pressable onPress={() => router.push(`/aliens/${species.slug}`)}>
      <ThemedView variant="card" className="mb-3 overflow-hidden rounded-xl">
        {species.imageUri !== undefined && (
          <Image
            source={
              typeof species.imageUri === 'string' ? { uri: species.imageUri } : species.imageUri
            }
            style={{ width: '100%', height: 120 }}
            contentFit="cover"
          />
        )}
        <View className="p-4">
          <View className="flex-row items-start justify-between mb-2">
            <HighlightedText text={species.name} highlight={searchQuery} />
            <View className="flex-row gap-2 ml-2">
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: categoryBadgeColor[species.category] ?? '#ffffff11' }}
              >
                <ThemedText
                  size="xs"
                  style={{ color: categoryTextColor[species.category] ?? '#ffffff' }}
                >
                  {capitalize(species.category)}
                </ThemedText>
              </View>
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: `${threatColor}22` }}
              >
                <ThemedText size="xs" style={{ color: threatColor }}>
                  {getThreatLabel(species.threatLevel)}
                </ThemedText>
              </View>
            </View>
          </View>

          <ThemedText variant="secondary" size="sm" numberOfLines={2} className="mb-2">
            {species.description}
          </ThemedText>

          <View className="flex-row items-center justify-between">
            <ThemedText variant="muted" size="xs">
              Origin: {species.origin}
            </ThemedText>
            <ThemedText variant="accent" size="xs">
              {species.traits.length} known traits
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}
