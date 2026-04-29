import { Linking, View } from 'react-native';
import { Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface LocationPermissionRequestProps {
  onRetry?: () => void;
}

export function LocationPermissionRequest({ onRetry }: LocationPermissionRequestProps) {
  return (
    <ThemedView variant="background" className="flex-1 items-center justify-center px-8">
      <ThemedText size="4xl" className="mb-4">📍</ThemedText>
      <ThemedText weight="bold" size="xl" className="text-center mb-2">
        Location Access Needed
      </ThemedText>
      <ThemedText variant="secondary" size="sm" className="text-center mb-8">
        ET Tracker needs your location to accurately log sighting coordinates. Your location is never shared without your consent.
      </ThemedText>

      <Pressable
        onPress={onRetry}
        className="bg-[#00D4FF] px-6 py-3 rounded-full mb-4"
      >
        <ThemedText weight="semibold" style={{ color: '#0A0A1A' }}>
          Grant Permission
        </ThemedText>
      </Pressable>

      <Pressable onPress={() => Linking.openSettings()}>
        <ThemedText variant="accent" size="sm">
          Open Settings
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
