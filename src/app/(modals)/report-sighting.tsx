import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { ThreatLevelSelector } from '@/components/threat-level-selector';
import { sanitizeText, validateCoordinates } from '@/utils/sanitize';
import { useSightingsContext } from '@/context/sightings-context';
import { SpeciesSelector } from '@/components/species-selector';
import { useUserLocation } from '@/hooks/use-user-location';
import { PhotoSection } from '@/components/photo-section';
import { sendSightingAlert } from '@/lib/notifications';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAppTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { router, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ThreatLevel } from '@/types';

interface FormState {
  title: string;
  description: string;
  photoUri: string | null;
  threatLevel: ThreatLevel;
  species: string;
  reporterName: string;
}

const INITIAL_STATE: FormState = {
  title: '',
  description: '',
  photoUri: null,
  threatLevel: 'low',
  species: '',
  reporterName: '',
};

export default function ReportSightingScreen() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const { addSighting } = useSightingsContext();
  const { colors } = useAppTheme();
  const { latitude, longitude } = useUserLocation();

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const FALLBACK_LOCATIONS = [
    { latitude: 40.7128, longitude: -74.006 },   // New York
    { latitude: 34.0522, longitude: -118.2437 },  // Los Angeles
    { latitude: 41.8781, longitude: -87.6298 },   // Chicago
    { latitude: 29.7604, longitude: -95.3698 },   // Houston
    { latitude: 33.449, longitude: -112.0741 },   // Phoenix
    { latitude: 39.9526, longitude: -75.1652 },   // Philadelphia
    { latitude: 29.4241, longitude: -98.4936 },   // San Antonio
    { latitude: 32.7767, longitude: -96.797 },    // Dallas
  ];

  function getFallbackLocation() {
    return FALLBACK_LOCATIONS[Math.floor(Math.random() * FALLBACK_LOCATIONS.length)];
  }

  function validate(): string | null {
    if (!form.title.trim()) return 'A title is required.';
    if (!form.description.trim()) return 'Please describe what you witnessed.';
    if (latitude && longitude && !validateCoordinates(latitude, longitude))
      return 'Invalid location coordinates.';
    return null;
  }

  async function handleSubmit() {
    const error = validate();
    if (error) {
      Alert.alert('Incomplete Report', error);
      return;
    }

    setSubmitting(true);
    try {
      const location = (latitude && longitude) ? { latitude, longitude } : getFallbackLocation();

      const sighting = await addSighting({
        title: sanitizeText(form.title, 80),
        description: sanitizeText(form.description, 1000),
        latitude: location.latitude,
        longitude: location.longitude,
        photoUri: form.photoUri ?? undefined,
        threatLevel: form.threatLevel,
        species: form.species ? sanitizeText(form.species, 50) : undefined,
        reporterName: form.reporterName ? sanitizeText(form.reporterName, 100) : undefined,
        reportedAt: new Date().toISOString(),
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await sendSightingAlert(sighting.title, sighting.species);

      router.dismiss();
      router.push(`/sightings/${sighting.id}`);
    } catch {
      Alert.alert('Error', 'Failed to save sighting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ThemedView variant="background" className="flex-1">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={() => router.dismiss()} hitSlop={8}>
              <MaterialIcons name="arrow-back" size={28} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FieldLabel>Sighting Title *</FieldLabel>
          <TextInput
            value={form.title}
            onChangeText={(v) => update('title', v)}
            placeholder="e.g. Triangular Formation Over Nevada"
            placeholderTextColor={colors.textMuted}
            className="rounded-xl px-4 py-3 border mb-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary,
              fontSize: 16,
            }}
            maxLength={80}
          />

          <FieldLabel>Description *</FieldLabel>
          <TextInput
            value={form.description}
            onChangeText={(v) => update('description', v)}
            placeholder="Describe the craft, lights, behavior, duration…"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="rounded-xl px-4 py-3 border mb-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary,
              fontSize: 16,
              minHeight: 120,
            }}
            maxLength={1000}
          />

          <FieldLabel>Threat Level *</FieldLabel>
          <View className="mb-4">
            <ThreatLevelSelector
              value={form.threatLevel}
              onChange={(v) => update('threatLevel', v)}
            />
          </View>

          <FieldLabel>Species (if identified)</FieldLabel>
          <View className="mb-4">
            <SpeciesSelector value={form.species} onChange={(v) => update('species', v)} />
          </View>

          <FieldLabel>Reporter Name (optional)</FieldLabel>
          <TextInput
            value={form.reporterName}
            onChangeText={(v) => update('reporterName', v)}
            placeholder="How should we attribute this report?"
            placeholderTextColor={colors.textMuted}
            className="rounded-xl px-4 py-3 border mb-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.textPrimary,
              fontSize: 16,
            }}
            maxLength={50}
          />

          <FieldLabel>Photo Evidence</FieldLabel>
          <View className="mb-6">
            <PhotoSection
              photoUri={form.photoUri}
              onPhotoSelected={(uri) => update('photoUri', uri)}
            />
          </View>

          {(!latitude || !longitude) && (
            <View className="bg-warning/[7%] border border-warning/30 rounded-xl px-4 py-3 mb-4">
              <ThemedText size="sm" className="text-warning">
                ⚠️ GPS unavailable — a random US location will be used for this report.
              </ThemedText>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            className="rounded-xl py-4 items-center"
            style={{
              backgroundColor: submitting ? `${colors.primary}66` : colors.primary,
            }}
          >
            <ThemedText weight="bold" style={{ color: colors.background }}>
              {submitting ? 'Submitting…' : 'Submit Report'}
            </ThemedText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText
      weight="semibold"
      size="sm"
      variant="secondary"
      className="mb-2 uppercase tracking-wide"
    >
      {children}
    </ThemedText>
  );
}
