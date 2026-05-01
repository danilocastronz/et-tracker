import { getThreatColor, getThreatEmoji, getThreatLabel } from '@/utils/threat-level';
import { Alert, Pressable, ScrollView, View, Share } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSightingsContext } from '@/context/sightings-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDate } from '@/utils/format-date';
import { capitalize } from '@/utils/capitalize';
import * as Sharing from 'expo-sharing';
import { Image } from 'expo-image';

export default function SightingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sightings, removeSighting } = useSightingsContext();
  const sighting = sightings.find((s) => s.id === id);
  const { colors } = useAppTheme();

  if (!sighting) {
    return (
      <ThemedView variant="background" className="flex-1 items-center justify-center">
        <ThemedText size="4xl" className="mb-3">
          🌌
        </ThemedText>
        <ThemedText weight="bold" size="lg">
          Sighting not found
        </ThemedText>
        <Pressable onPress={() => router.back()} className="mt-4">
          <ThemedText variant="accent">← Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }
  const threatColor = getThreatColor(sighting.threatLevel);
  const date = formatDate(sighting.reportedAt);

  function openInMaps() {
    router.push(`/(tabs)/sightings?focusId=${sighting!.id}`);
  }

  async function handleShare() {
    try {
      if (sighting?.photoUri) {
        // Share photo using expo-sharing
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(sighting.photoUri);
        }
      } else {
        // Share text summary using React Native Share API
        const summary = [
          sighting.title,
          `Threat Level: ${getThreatLabel(sighting.threatLevel)}`,
          `Date: ${date}`,
          sighting.species ? `Species: ${capitalize(sighting.species)}` : null,
          sighting.reporterName ? `Reported by: ${sighting.reporterName}` : null,
          `Coordinates: ${sighting.latitude.toFixed(5)}, ${sighting.longitude.toFixed(5)}`,
          '',
          sighting.description,
        ]
          .filter(Boolean)
          .join('\n');

        await Share.share({
          message: summary,
          title: 'Share Sighting Report',
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  function handleDelete() {
    Alert.alert('Delete Sighting', 'This report will be permanently removed. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeSighting(sighting!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <ThemedView variant="background" className="flex-1">
      <Stack.Screen
        options={{
          title: 'Sighting Details',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <MaterialIcons name="arrow-back" size={28} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        {sighting.photoUri && (
          <Image
            source={{ uri: sighting.photoUri }}
            style={{ width: '100%', height: 240 }}
            contentFit="cover"
          />
        )}

        <View className="px-5 pt-5">
          {/* Title + Threat */}
          <View className="flex-row items-start justify-between mb-1">
            <ThemedText weight="bold" size="2xl" className="flex-1 mr-3">
              {sighting.title}
            </ThemedText>
            <View
              className="rounded-full px-3 py-1 mt-1"
              style={{ backgroundColor: `${threatColor}22` }}
            >
              <ThemedText size="sm" style={{ color: threatColor }}>
                {getThreatEmoji(sighting.threatLevel)} {getThreatLabel(sighting.threatLevel)}
              </ThemedText>
            </View>
          </View>

          {/* Meta row */}
          <View className="flex-row gap-3 mb-4 flex-wrap">
            {sighting.species && (
              <View className="bg-primary/10 dark:bg-primary-dark/10 rounded-full px-3 py-1">
                <ThemedText variant="accent" size="xs">
                  Species: {capitalize(sighting.species)}
                </ThemedText>
              </View>
            )}
            {sighting.reporterName && (
              <View className="bg-card dark:bg-card-dark rounded-full px-3 py-1">
                <ThemedText variant="secondary" size="xs">
                  Reported by {sighting.reporterName}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Description */}
          <ThemedText variant="secondary" size="base" className="leading-relaxed mb-5">
            {sighting.description}
          </ThemedText>

          {/* Date */}
          <View className="flex-row items-center mb-2">
            <ThemedText variant="muted" size="xs">
              📅 {date}
            </ThemedText>
          </View>

          {/* Coordinates + Maps button */}
          <View className="bg-card dark:bg-card-dark rounded-xl p-4 mb-5">
            <View className="flex-row items-center justify-between">
              <View>
                <ThemedText variant="muted" size="xs" className="mb-1">
                  COORDINATES
                </ThemedText>
                <ThemedText weight="medium" size="sm">
                  {sighting.latitude.toFixed(5)}, {sighting.longitude.toFixed(5)}
                </ThemedText>
              </View>
              <Pressable
                onPress={openInMaps}
                className="bg-primary/10 dark:bg-primary-dark/10 rounded-lg px-4 py-2"
              >
                <ThemedText variant="accent" size="sm" weight="semibold">
                  Open in Maps
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Species link */}
          {sighting.species && (
            <Pressable
              onPress={() => router.push(`/aliens/${sighting.species}`)}
              className="flex-row items-center justify-between bg-card dark:bg-card-dark rounded-xl p-4"
            >
              <View>
                <ThemedText weight="semibold" size="sm">
                  View Species Profile
                </ThemedText>
                <ThemedText variant="secondary" size="xs" className="mt-0.5">
                  {capitalize(sighting.species)} field guide entry
                </ThemedText>
              </View>
              <ThemedText variant="accent" size="lg">
                ›
              </ThemedText>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-background dark:bg-background-dark"
        style={{ gap: 12 }}
      >
        <Pressable onPress={handleShare} className="bg-blue-600 rounded-xl p-4 items-center">
          <ThemedText weight="bold" size="sm" className="text-white">
            Share Sighting
          </ThemedText>
        </Pressable>
        <Pressable onPress={handleDelete} className="bg-red-600 rounded-xl p-4 items-center">
          <ThemedText weight="bold" size="sm" className="text-white">
            Delete Sighting
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}
