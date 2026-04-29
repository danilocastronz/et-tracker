import { Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignupScreen() {
  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1 px-6 justify-center">
        <View className="items-center mb-10">
          <ThemedText size="4xl" className="mb-2">👽</ThemedText>
          <ThemedText weight="bold" size="3xl" className="text-center">Join the Network</ThemedText>
          <ThemedText variant="secondary" size="sm" className="text-center mt-2">
            Create an account to log and share your sightings
          </ThemedText>
        </View>

        <View className="gap-3 mb-6">
          <TextInput
            placeholder="Username"
            placeholderTextColor="#555577"
            autoCapitalize="none"
            className="bg-[#1A1A35] rounded-xl px-4 py-4 border border-[#2A2A4A]"
            style={{ color: '#E8E8FF', fontSize: 16 }}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#555577"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-[#1A1A35] rounded-xl px-4 py-4 border border-[#2A2A4A]"
            style={{ color: '#E8E8FF', fontSize: 16 }}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555577"
            secureTextEntry
            className="bg-[#1A1A35] rounded-xl px-4 py-4 border border-[#2A2A4A]"
            style={{ color: '#E8E8FF', fontSize: 16 }}
          />
        </View>

        <Pressable
          className="bg-[#00D4FF] rounded-xl py-4 items-center mb-4"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <ThemedText weight="bold" style={{ color: '#0A0A1A' }}>Create Account</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="py-3 items-center"
        >
          <ThemedText variant="secondary" size="sm">
            Already have an account?{' '}
            <ThemedText variant="accent" size="sm" weight="semibold">Sign In</ThemedText>
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="mt-8 py-3 items-center"
        >
          <ThemedText variant="muted" size="xs">[Dev] Skip to App →</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
