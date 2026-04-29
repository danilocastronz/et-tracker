import { memo } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Sighting } from '@/types';
import { getThreatColor } from '@/utils/threatLevel';

interface SightingMarkerProps {
  sighting: Sighting;
  onPress?: (sighting: Sighting) => void;
  children?: React.ReactNode;
}

export const SightingMarker = memo(function SightingMarker({
  sighting,
  onPress,
  children,
}: SightingMarkerProps) {
  const color = getThreatColor(sighting.threatLevel);

  return (
    <Marker
      coordinate={{ latitude: sighting.latitude, longitude: sighting.longitude }}
      tracksViewChanges={false}
      onPress={() => onPress?.(sighting)}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: '#ffffff44',
          shadowColor: color,
          shadowOpacity: 0.8,
          shadowRadius: 6,
          elevation: 4,
        }}
      />
      {children}
    </Marker>
  );
});
