// Background task definitions for native code execution
// IMPORTANT: This file must be imported in app/_layout.tsx to register tasks with Expo TaskManager
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const BACKGROUND_LOCATION_TASK = 'background-location-task';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    if (__DEV__) {
      console.error('Background location error:', error.message);
    }
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const latest = locations[locations.length - 1];
    if (latest && __DEV__) {
      console.log('Background location update:', {
        lat: latest.coords.latitude,
        lng: latest.coords.longitude,
      });
    }
  }
});

export async function startBackgroundLocationTracking(): Promise<void> {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status !== 'granted') return;

  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
  if (isRegistered) return;

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 100,
    deferredUpdatesInterval: 60_000,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: 'ET Tracker',
      notificationBody: 'Monitoring for alien activity…',
      notificationColor: '#00D4FF',
    },
  });
}

export async function stopBackgroundLocationTracking(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_TASK);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}
