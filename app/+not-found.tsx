import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <ThemedView variant="background" className="flex-1 items-center justify-center px-8">
      <ThemedText size="4xl" className="mb-4">🌌</ThemedText>
      <ThemedText weight="bold" size="2xl" className="text-center mb-2">
        Lost in Space
      </ThemedText>
      <ThemedText variant="secondary" size="base" className="text-center mb-8">
        This sector of the galaxy doesn't exist in our records.
      </ThemedText>
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        className="bg-[#00D4FF] px-6 py-3 rounded-full"
      >
        <ThemedText weight="semibold" style={{ color: '#0A0A1A' }}>
          Return to Base
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
