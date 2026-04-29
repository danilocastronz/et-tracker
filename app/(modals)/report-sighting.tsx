import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { PhotoSection } from '@/components/report/PhotoSection';
import { ThreatLevelSelector } from '@/components/report/ThreatLevelSelector';
import { SpeciesSelector } from '@/components/report/SpeciesSelector';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSightingsContext } from '@/context/SightingsContext';
import { useUserLocation } from '@/hooks/useUserLocation';
import { ThreatLevel } from '@/types';
import { sendSightingAlert } from '@/lib/notifications';

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
  const { latitude, longitude } = useUserLocation();

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  function validate(): string | null {
    if (!form.title.trim()) return 'A title is required.';
    if (!form.description.trim()) return 'Please describe what you witnessed.';
    if (!latitude || !longitude) return 'Unable to determine your location. Please try again.';
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
      const sighting = addSighting({
        title: form.title.trim(),
        description: form.description.trim(),
        latitude: latitude!,
        longitude: longitude!,
        photoUri: form.photoUri ?? undefined,
        threatLevel: form.threatLevel,
        species: form.species || undefined,
        reporterName: form.reporterName.trim() || undefined,
        reportedAt: new Date().toISOString(),
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await sendSightingAlert(sighting.title, sighting.species);

      router.dismiss();
      router.push(`/sightings/${sighting.id}`);
    } catch (err) {
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
              <MaterialIcons name="arrow-back" size={28} color="#00D4FF" />
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
            placeholderTextColor="#555577"
            className="bg-[#1A1A35] rounded-xl px-4 py-3 border border-[#2A2A4A] mb-4"
            style={{ color: '#E8E8FF', fontSize: 16 }}
            maxLength={80}
          />

          <FieldLabel>Description *</FieldLabel>
          <TextInput
            value={form.description}
            onChangeText={(v) => update('description', v)}
            placeholder="Describe the craft, lights, behavior, duration…"
            placeholderTextColor="#555577"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="bg-[#1A1A35] rounded-xl px-4 py-3 border border-[#2A2A4A] mb-4"
            style={{ color: '#E8E8FF', fontSize: 16, minHeight: 120 }}
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
            <SpeciesSelector
              value={form.species}
              onChange={(v) => update('species', v)}
            />
          </View>

          <FieldLabel>Reporter Name (optional)</FieldLabel>
          <TextInput
            value={form.reporterName}
            onChangeText={(v) => update('reporterName', v)}
            placeholder="How should we attribute this report?"
            placeholderTextColor="#555577"
            className="bg-[#1A1A35] rounded-xl px-4 py-3 border border-[#2A2A4A] mb-4"
            style={{ color: '#E8E8FF', fontSize: 16 }}
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
            <View className="bg-[#F59E0B11] border border-[#F59E0B33] rounded-xl px-4 py-3 mb-4">
              <ThemedText size="sm" style={{ color: '#F59E0B' }}>
                ⚠️ Acquiring your location… Submission requires GPS coordinates.
              </ThemedText>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            className="rounded-xl py-4 items-center"
            style={{
              backgroundColor: submitting ? '#00D4FF66' : '#00D4FF',
            }}
          >
            <ThemedText weight="bold" style={{ color: '#0A0A1A' }}>
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
    <ThemedText weight="semibold" size="sm" variant="secondary" className="mb-2 uppercase tracking-wide">
      {children}
    </ThemedText>
  );
}
