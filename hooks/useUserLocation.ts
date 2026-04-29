import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  permissionDenied: boolean;
  loading: boolean;
}

export function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    permissionDenied: false,
    loading: true,
  });

  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setState({ latitude: null, longitude: null, permissionDenied: true, loading: false });
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        permissionDenied: false,
        loading: false,
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, requestLocation };
}
