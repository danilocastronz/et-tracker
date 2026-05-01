import { Marker } from 'react-native-maps';
import { Sighting } from '@/types';

interface SightingMarkerProps {
  sighting: Sighting;
  onPress?: (sighting: Sighting) => void;
}

export function SightingMarker({ sighting, onPress }: SightingMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: sighting.latitude,
        longitude: sighting.longitude,
      }}
      onPress={() => onPress?.(sighting)}
    />
  );
}
