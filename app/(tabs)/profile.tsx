import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { File, Directory, Paths } from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePreferences } from '@/hooks/usePreferences';
import { useAppTheme } from '@/context/ThemeContext';
import { useSightingsContext } from '@/context/SightingsContext';

function persistAvatar(tempUri: string): string {
  const dir = new Directory(Paths.document, 'avatars');
  if (!dir.exists) dir.create();
  const dest = new File(dir, 'avatar.jpg');
  new File(tempUri).copy(dest);
  return dest.uri;
}

export default function ProfileScreen() {
  const { sightings } = useSightingsContext();
  const { preferences, loading, updatePreferences } = usePreferences();
  const { isDark, setColorScheme, colors } = useAppTheme();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const inputRef = useRef<TextInput>(null);

  function startEditingName() {
    setNameInput(preferences.displayName);
    setEditingName(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function saveName() {
    const trimmed = nameInput.trim();
    if (trimmed) await updatePreferences({ displayName: trimmed });
    setEditingName(false);
  }

  async function pickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to set a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const uri = persistAvatar(result.assets[0].uri);
    await updatePreferences({ avatarUri: uri });
  }

  if (loading) {
    return (
      <ThemedView variant="background" className="flex-1 items-center justify-center">
        <ThemedText variant="muted">Loading…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView variant="background" className="flex-1">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Header */}
          <View className="items-center pt-8 pb-6">
            {/* Avatar */}
            <Pressable onPress={pickAvatar} style={{ marginBottom: 12 }}>
              <View
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: colors.card,
                  borderWidth: 2,
                  borderColor: colors.border,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {preferences.avatarUri ? (
                  <Image
                    source={{ uri: preferences.avatarUri }}
                    style={{ width: 88, height: 88 }}
                    contentFit="cover"
                  />
                ) : (
                  <ThemedText size="4xl">👽</ThemedText>
                )}
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#00D4FF',
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="edit" size={14} color="#0A0A1A" />
              </View>
            </Pressable>

            {/* Name */}
            {editingName ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  ref={inputRef}
                  value={nameInput}
                  onChangeText={setNameInput}
                  onBlur={saveName}
                  onSubmitEditing={saveName}
                  returnKeyType="done"
                  maxLength={40}
                  style={{
                    color: colors.textPrimary,
                    fontSize: 20,
                    fontWeight: '700',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.primary,
                    minWidth: 120,
                    textAlign: 'center',
                    paddingVertical: 2,
                  }}
                />
                <Pressable onPress={saveName} hitSlop={8}>
                  <MaterialIcons name="check" size={22} color="#00D4FF" />
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={startEditingName} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ThemedText weight="bold" size="xl">{preferences.displayName}</ThemedText>
                <MaterialIcons name="edit" size={16} color={colors.textMuted} />
              </Pressable>
            )}

            <ThemedText variant="secondary" size="sm" className="mt-1">
              {sightings.length} sighting{sightings.length !== 1 ? 's' : ''} logged
            </ThemedText>
          </View>

          {/* Stats */}
          <View className="mx-4 rounded-xl p-4 mb-6 flex-row justify-around" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            {[
              { label: 'Total', value: sightings.length },
              { label: 'Critical', value: sightings.filter((s) => s.threatLevel === 'critical').length },
              { label: 'With Photo', value: sightings.filter((s) => s.photoUri).length },
            ].map((stat) => (
              <View key={stat.label} className="items-center">
                <ThemedText weight="bold" size="2xl" variant="accent">{stat.value}</ThemedText>
                <ThemedText variant="secondary" size="xs" className="mt-1">{stat.label}</ThemedText>
              </View>
            ))}
          </View>

          {/* Appearance */}
          <ThemedText
            weight="semibold"
            size="xs"
            variant="muted"
            className="uppercase tracking-widest px-4 mb-2"
          >
            Appearance
          </ThemedText>
          <View className="mx-4 rounded-xl px-4 py-3 mb-6 flex-row items-center justify-between" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <View className="flex-row items-center gap-3">
              <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
              <ThemedText size="sm" weight="medium">Dark Mode</ThemedText>
            </View>
            <Switch
              value={isDark}
              onValueChange={(val) => setColorScheme(val ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: `${colors.primary}66` }}
              thumbColor={isDark ? colors.primary : colors.textMuted}
            />
          </View>

          {/* About */}
          <ThemedText
            weight="semibold"
            size="xs"
            variant="muted"
            className="uppercase tracking-widest px-4 mb-2"
          >
            About
          </ThemedText>
          <View className="mx-4 rounded-xl p-4" style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}>
            <ThemedText variant="secondary" size="sm" className="text-center">
              ET Tracker v1.0.0{'\n'}Built with Expo SDK 54 & React Native
            </ThemedText>
            <ThemedText variant="muted" size="xs" className="text-center mt-2">
              The truth is out there.
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
