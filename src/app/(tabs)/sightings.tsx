import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { cn } from '@/lib/utils';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SightingMarker } from '@/components/SightingMarker';
import { SightingMapCard } from '@/components/SightingMapCard';
import { SightingListItem } from '@/components/SightingListItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DARK_MAP_STYLE } from '@/constants/mapStyle';
import { useSightingsContext } from '@/context/SightingsContext';
import { useAppTheme } from '@/context/ThemeContext';
import { Sighting, ThreatLevel } from '@/types';
import { capitalize } from '@/utils/capitalize';
import { getThreatColor, getThreatLabel } from '@/utils/threatLevel';
import { FlashList } from '@shopify/flash-list';

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

export default function SightingsScreen() {
  const { sightings } = useSightingsContext();
  const { colors } = useAppTheme();
  const { focusId, view, threat } = useLocalSearchParams<{ focusId?: string; view?: string; threat?: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>(view === 'list' ? 'list' : 'map');

  const FAB_STYLE = {
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
  };
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [threatFilter, setThreatFilter] = useState<ThreatLevel | 'all'>(
    (threat as ThreatLevel) ?? 'all'
  );

  const THREAT_LEVELS: Array<ThreatLevel | 'all'> = ['all', 'low', 'medium', 'high', 'critical'];
  const mapRef = useRef<MapView>(null);
  const markerJustPressed = useRef(false);

  const speciesOptions = useMemo(() => {
    const set = new Set(sightings.map((s) => s.species).filter(Boolean) as string[]);
    return ['all', ...Array.from(set).sort()];
  }, [sightings]);

  const visibleSightings = useMemo(() =>
    sightings.filter((s) =>
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
      { latitude: target.latitude, longitude: target.longitude, latitudeDelta: 2, longitudeDelta: 2 },
      600
    );
  }, [focusId, sightings]);

  const handleMarkerPress = useCallback((sighting: Sighting) => {
    markerJustPressed.current = true;
    setSelectedSighting(sighting);
    mapRef.current?.animateToRegion(
      { latitude: sighting.latitude, longitude: sighting.longitude, latitudeDelta: 2, longitudeDelta: 2 },
      500
    );
    setTimeout(() => { markerJustPressed.current = false; }, 300);
  }, []);

  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <ThemedText weight="bold" size="xl">Sightings</ThemedText>
          <View className="flex-row bg-card dark:bg-card-dark rounded-full p-1 gap-1">
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
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 4, paddingBottom: 4, alignItems: 'center' }}
        >
          {THREAT_LEVELS.map((level) => {
            const active = threatFilter === level;
            const color = level === 'all' ? colors.primary : getThreatColor(level);
            return (
              <Pressable
                key={level}
                onPress={() => {
                  setThreatFilter(level);
                  if (selectedSighting && level !== 'all' && selectedSighting.threatLevel !== level) {
                    setSelectedSighting(null);
                  }
                }}
                className={cn(
                  'rounded-full border',
                  !active && 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
                )}
                style={active ? { paddingHorizontal: 12, paddingVertical: 3, backgroundColor: `${color}22`, borderColor: color } : { paddingHorizontal: 12, paddingVertical: 3 }}
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
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 4, paddingBottom: 8, alignItems: 'center' }}
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
              provider={PROVIDER_DEFAULT}
              initialRegion={INITIAL_REGION}
              customMapStyle={DARK_MAP_STYLE}
              showsUserLocation
              showsCompass={false}
              toolbarEnabled={false}
              onPress={() => { if (!markerJustPressed.current) setSelectedSighting(null); }}
            >
              {visibleSightings.map((sighting) => (
                <SightingMarker
                  key={sighting.id}
                  sighting={sighting}
                  onPress={handleMarkerPress}
                />
              ))}
            </MapView>

            {/* Left FABs */}
            <View style={{ position: 'absolute', bottom: 24, left: 20, gap: 12 }}>
              <Pressable
                onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 600)}
                style={FAB_STYLE}
              >
                <MaterialIcons name="zoom-out-map" size={22} color={colors.textPrimary} />
              </Pressable>

              <Pressable
                onPress={() => mapRef.current?.animateToRegion(AREA_51, 600)}
                style={FAB_STYLE}
              >
                <Text style={{ fontSize: 24, lineHeight: 30 }}>👽</Text>
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
              <ThemedText size="2xl" style={{ color: colors.background }}>+</ThemedText>
            </Pressable>

            {selectedSighting && (
              <SightingMapCard
                sighting={selectedSighting}
                onDismiss={() => setSelectedSighting(null)}
              />
            )}
          </View>
        ) : (
          <FlashList
            data={visibleSightings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SightingListItem sighting={item} />}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
              <ThemedText variant="muted" className="text-center mt-8">
                No sightings logged yet.
              </ThemedText>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
