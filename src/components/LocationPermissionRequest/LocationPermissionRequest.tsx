import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { Linking, Pressable } from 'react-native';

interface LocationPermissionRequestProps {
  onRetry?: () => void;
}

export function LocationPermissionRequest({ onRetry }: LocationPermissionRequestProps) {
  const { colors } = useAppTheme();

  return (
    <ThemedView variant="background" className="items-center justify-center flex-1 px-8">
      <ThemedText size="4xl" className="mb-4">
        📍
      </ThemedText>
      <ThemedText weight="bold" size="xl" className="mb-2 text-center">
        Location Access Needed
      </ThemedText>
      <ThemedText variant="secondary" size="sm" className="mb-8 text-center">
        ET Tracker needs your location to accurately log sighting coordinates. Your location is
        never shared without your consent.
      </ThemedText>

      <Pressable
        onPress={onRetry}
        className="px-6 py-3 mb-4 rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <ThemedText weight="semibold" style={{ color: colors.background }}>
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
