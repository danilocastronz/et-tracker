import { useCallback, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SightingMarker } from '@/components/SightingMarker';
import { SightingCallout } from '@/components/SightingCallout';
import { SightingListItem } from '@/components/SightingListItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DARK_MAP_STYLE } from '@/constants/mapStyle';
import { useSightingsContext } from '@/context/SightingsContext';
import { Sighting } from '@/types';
import { FlashList } from '@shopify/flash-list';

type ViewMode = 'map' | 'list';

const INITIAL_REGION = {
  latitude: 37.5,
  longitude: -100,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

export default function SightingsScreen() {
  const { sightings } = useSightingsContext();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedSighting, setSelectedSighting] = useState<Sighting | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleMarkerPress = useCallback((sighting: Sighting) => {
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
  }, []);

  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <ThemedText weight="bold" size="xl">Sightings</ThemedText>
          <View className="flex-row bg-[#1A1A35] rounded-full p-1 gap-1">
            {(['map', 'list'] as ViewMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setViewMode(mode)}
                className="px-4 py-1.5 rounded-full"
                style={{ backgroundColor: viewMode === mode ? '#00D4FF22' : 'transparent' }}
              >
                <ThemedText
                  size="sm"
                  style={{ color: viewMode === mode ? '#00D4FF' : '#555577' }}
                >
                  {mode === 'map' ? '🗺️ Map' : '📋 List'}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

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
            >
              {sightings.map((sighting) => (
                <SightingMarker
                  key={sighting.id}
                  sighting={sighting}
                  onPress={handleMarkerPress}
                >
                  {selectedSighting?.id === sighting.id && (
                    <SightingCallout sighting={sighting} />
                  )}
                </SightingMarker>
              ))}
            </MapView>

            {/* FAB */}
            <Pressable
              onPress={() => router.push('/(modals)/report-sighting')}
              style={{
                position: 'absolute',
                bottom: 24,
                right: 20,
                backgroundColor: '#00D4FF',
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#00D4FF',
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <ThemedText size="2xl" style={{ color: '#0A0A1A' }}>+</ThemedText>
            </Pressable>
          </View>
        ) : (
          <FlashList
            data={sightings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SightingListItem sighting={item} />}
            estimatedItemSize={72}
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
