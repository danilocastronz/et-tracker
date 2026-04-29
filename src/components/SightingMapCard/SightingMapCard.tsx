import { getThreatColor, getThreatEmoji, getThreatLabel } from '@/utils/threatLevel';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDate } from '@/utils/formatDate';
import { capitalize } from '@/utils/capitalize';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Sighting } from '@/types';

interface SightingMapCardProps {
  sighting: Sighting;
  onDismiss: () => void;
}

export function SightingMapCard({ sighting, onDismiss }: SightingMapCardProps) {
  const threatColor = getThreatColor(sighting.threatLevel);
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 96,
        left: 16,
        right: 16,
        zIndex: 100,
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderTopWidth: 3,
        borderTopColor: threatColor,
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 20,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <ThemedText weight="bold" size="base" numberOfLines={2} style={{ flex: 1, marginRight: 8 }}>
          {sighting.title}
        </ThemedText>
        <Pressable onPress={onDismiss} hitSlop={8}>
          <MaterialIcons name="close" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 6,
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <View
          style={{
            backgroundColor: `${threatColor}22`,
            borderRadius: 99,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <ThemedText size="xs" style={{ color: threatColor }}>
            {getThreatEmoji(sighting.threatLevel)} {getThreatLabel(sighting.threatLevel)}
          </ThemedText>
        </View>
        {sighting.species && (
          <ThemedText variant="muted" size="xs">
            · {capitalize(sighting.species)}
          </ThemedText>
        )}
        <ThemedText variant="muted" size="xs">
          · {formatDate(sighting.reportedAt)}
        </ThemedText>
      </View>

      {sighting.description ? (
        <ThemedText variant="secondary" size="sm" numberOfLines={2} style={{ marginTop: 8 }}>
          {sighting.description}
        </ThemedText>
      ) : null}

      <Pressable
        onPress={() => router.push(`/sightings/${sighting.id}`)}
        style={{
          marginTop: 12,
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingVertical: 10,
          alignItems: 'center',
        }}
      >
        <ThemedText weight="semibold" size="sm" style={{ color: colors.background }}>
          View Details →
        </ThemedText>
      </Pressable>
    </View>
  );
}
