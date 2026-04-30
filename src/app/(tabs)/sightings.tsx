import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SightingCardSkeleton } from '@/components/SightingCardSkeleton';
import { getThreatColor, getThreatLabel } from '@/utils/threatLevel';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { SightingListItem } from '@/components/SightingListItem';
import { useSightingsContext } from '@/context/SightingsContext';
import { SightingMapCard } from '@/components/SightingMapCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SightingMarker } from '@/components/SightingMarker';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { router, useLocalSearchParams } from 'expo-router';
import { DARK_MAP_STYLE } from '@/constants/mapStyle';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { LOADING_DELAY } from '@/constants/loading';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { capitalize } from '@/utils/capitalize';
import { Sighting, ThreatLevel } from '@/types';
import { cn } from '@/lib/utils';

type ViewMode = 'map' | 'list';

const INITIAL_REGION = {
  latitude: 37.5,
  longitude: -100,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

const AREA_51 = {
  latitude: 37.235,
  longitude: -115.8111,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

const THREAT_LEVELS: (ThreatLevel | 'all')[] = ['all', 'low', 'medium', 'high', 'critical'];

export default function SightingsScreen() {
  const { sightings } = useSightingsContext();
  const { colors } = useAppTheme();
  const { focusId, view, threat } = useLocalSearchParams<{
    focusId?: string;
    view?: string;
    threat?: string;
  }>();
  const [viewMode, setViewMode] = useState<ViewMode>(view === 'list' ? 'list' : 'map');
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [threatFilter, setThreatFilter] = useState<ThreatLevel | 'all'>(
    (threat as ThreatLevel) ?? 'all'
  );
  const [isLoading, setIsLoading] = useState(true);

  const mapRef = useRef<MapView>(null);
  const markerJustPressed = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const fabStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    }),
    [colors.surface, colors.border]
  );

  const speciesOptions = useMemo(() => {
    const set = new Set(sightings.map((s) => s.species).filter(Boolean) as string[]);
    return ['all', ...Array.from(set).sort()];
  }, [sightings]);

  const visibleSightings = useMemo(
    () =>
      sightings.filter(
        (s) =>
          (speciesFilter === 'all' || s.species === speciesFilter) &&
          (threatFilter === 'all' || s.threatLevel === threatFilter)
      ),
    [sightings, speciesFilter, threatFilter]
  );

  useEffect(() => {
    if (!focusId) return;
    const target = sightings.find((s) => s.id === focusId);
    if (!target) return;
    setViewMode('map');
    setSelectedSighting(target);
    mapRef.current?.animateToRegion(
      {
        latitude: target.latitude,
        longitude: target.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
      600
    );
  }, [focusId, sightings]);

  const handleMarkerPress = useCallback((sighting: Sighting) => {
    markerJustPressed.current = true;
    setSelectedSighting(sighting);
    mapRef.current?.animateToRegion(
      {
        latitude: sighting.latitude,
        longitude: sighting.longitude,
        latitudeDelta: 2,
        longitudeDelta: 2,
      },
      500
    );
    setTimeout(() => {
      markerJustPressed.current = false;
    }, 300);
  }, []);

  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <ThemedText weight="bold" size="xl">
            Sightings
          </ThemedText>
          <View className="flex-row gap-1 p-1 rounded-full bg-card dark:bg-card-dark">
            {(['map', 'list'] as ViewMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setViewMode(mode)}
                className={cn(
                  'px-3 py-1.5 rounded-full',
                  viewMode === mode ? 'bg-primary/10 dark:bg-primary-dark/10' : ''
                )}
              >
                <MaterialIcons
                  name={mode === 'map' ? 'map' : 'view-list'}
                  size={22}
                  color={viewMode === mode ? colors.primary : colors.textMuted}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Threat filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
            paddingTop: 4,
            paddingBottom: 4,
            alignItems: 'center',
          }}
        >
          {THREAT_LEVELS.map((level) => {
            const active = threatFilter === level;
            const color = level === 'all' ? colors.primary : getThreatColor(level);
            return (
              <Pressable
                key={level}
                onPress={() => {
                  setThreatFilter(level);
                  if (
                    selectedSighting &&
                    level !== 'all' &&
                    selectedSighting.threatLevel !== level
                  ) {
                    setSelectedSighting(null);
                  }
                }}
                className={cn(
                  'rounded-full border',
                  !active && 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
                )}
                style={
                  active
                    ? {
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        backgroundColor: `${color}22`,
                        borderColor: color,
                      }
                    : { paddingHorizontal: 12, paddingVertical: 3 }
                }
              >
                <ThemedText
                  size="sm"
                  weight={active ? 'semibold' : 'normal'}
                  variant={active ? 'primary' : 'secondary'}
                  style={active ? { color } : undefined}
                >
                  {level === 'all' ? 'All threats' : getThreatLabel(level)}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ height: 6 }} />

        {/* Species filter */}
        {speciesOptions.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{
              paddingHorizontal: 16,
              gap: 8,
              paddingTop: 4,
              paddingBottom: 8,
              alignItems: 'center',
            }}
          >
            {speciesOptions.map((sp) => {
              const active = speciesFilter === sp;
              return (
                <Pressable
                  key={sp}
                  onPress={() => {
                    setSpeciesFilter(sp);
                    if (selectedSighting && sp !== 'all' && selectedSighting.species !== sp) {
                      setSelectedSighting(null);
                    }
                  }}
                  className={cn(
                    'px-3 py-1 rounded-full border',
                    active
                      ? 'bg-primary/10 dark:bg-primary-dark/10 border-primary dark:border-primary-dark'
                      : 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
                  )}
                >
                  <ThemedText
                    size="sm"
                    weight={active ? 'semibold' : 'normal'}
                    variant={active ? 'accent' : 'secondary'}
                  >
                    {sp === 'all' ? 'All species' : capitalize(sp)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {viewMode === 'map' ? (
          <View className="flex-1">
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={INITIAL_REGION}
              customMapStyle={Platform.OS === 'android' ? undefined : DARK_MAP_STYLE}
              showsUserLocation={true}
              showsCompass={false}
              toolbarEnabled={false}
              moveOnMarkerPress={false}
              onPress={() => {
                if (!markerJustPressed.current) setSelectedSighting(null);
              }}
            >
              {visibleSightings.map((sighting) => (
                <SightingMarker key={sighting.id} sighting={sighting} onPress={handleMarkerPress} />
              ))}
            </MapView>

            {/* Left FABs */}
            <View style={{ position: 'absolute', bottom: 24, left: 20, gap: 12 }}>
              <Pressable
                onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 600)}
                style={fabStyle}
              >
                <MaterialIcons name="zoom-out-map" size={22} color={colors.textPrimary} />
              </Pressable>

              <Pressable
                onPress={() => mapRef.current?.animateToRegion(AREA_51, 600)}
                style={fabStyle}
              >
                <ThemedText style={{ fontSize: 24, lineHeight: 30 }}>👽</ThemedText>
              </Pressable>
            </View>

            {/* Report FAB */}
            <Pressable
              onPress={() => router.push('/(modals)/report-sighting')}
              style={{
                position: 'absolute',
                bottom: 24,
                right: 20,
                backgroundColor: colors.primary,
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.primary,
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <ThemedText size="2xl" style={{ color: colors.background }}>
                +
              </ThemedText>
            </Pressable>

            {selectedSighting && (
              <SightingMapCard
                sighting={selectedSighting}
                onDismiss={() => setSelectedSighting(null)}
              />
            )}
          </View>
        ) : (
          <View className="flex-1">
            {isLoading ? (
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <SightingCardSkeleton />
                <SightingCardSkeleton />
                <SightingCardSkeleton />
                <SightingCardSkeleton />
                <SightingCardSkeleton />
              </ScrollView>
            ) : (
              <FlashList
                data={visibleSightings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SightingListItem sighting={item} />}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                  <ThemedText variant="muted" className="mt-8 text-center">
                    No sightings logged yet.
                  </ThemedText>
                }
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
