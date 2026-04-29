import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { ThemedText } from '@/components';
import { ThemedView } from '@/components';

export default function NotFoundScreen() {
  const { colors } = useAppTheme();

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
        className="px-6 py-3 rounded-full"
        style={{ backgroundColor: colors.primary }}
      >
        <ThemedText weight="semibold" style={{ color: colors.background }}>
          Return to Base
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
