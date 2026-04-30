import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { ProfileStatsSkeleton } from '@/components/ProfileStatsSkeleton';
import { useSightingsContext } from '@/context/SightingsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Directory, File, Paths } from 'expo-file-system';
import { usePreferences } from '@/hooks/usePreferences';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAppTheme } from '@/context/ThemeContext';
import { LOADING_DELAY } from '@/constants/loading';
import { useEffect, useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Image } from 'expo-image';

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
  const { colors } = useAppTheme();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DELAY);

    return () => clearTimeout(timer);
  }, []);

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

  if (loading || isLoading) {
    return (
      <ThemedView variant="background" className="flex-1">
        <SafeAreaView className="flex-1" edges={['top']}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            <ProfileStatsSkeleton />
            {/* About skeleton */}
            <View className="px-4">
              <View className="h-8" />
              <View className="p-4 border bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-xl">
                <View className="items-center">
                  <View className="w-48 h-12 rounded bg-border dark:bg-border-dark" />
                  <View className="h-2" />
                  <View className="w-32 h-10 rounded bg-border dark:bg-border-dark" />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
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
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="edit" size={14} color={colors.background} />
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
                  <MaterialIcons name="check" size={22} color={colors.primary} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={startEditingName}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <ThemedText weight="bold" size="xl">
                  {preferences.displayName}
                </ThemedText>
                <MaterialIcons name="edit" size={16} color={colors.textMuted} />
              </Pressable>
            )}

            <ThemedText variant="secondary" size="sm" className="mt-1">
              {sightings.length} sighting{sightings.length !== 1 ? 's' : ''} logged
            </ThemedText>
          </View>

          {/* Stats */}
          <View className="flex-row justify-around p-4 mx-4 mb-6 border bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-xl">
            {[
              { label: 'Total', value: sightings.length },
              {
                label: 'Critical',
                value: sightings.filter((s) => s.threatLevel === 'critical').length,
              },
              { label: 'With Photo', value: sightings.filter((s) => s.photoUri).length },
            ].map((stat) => (
              <View key={stat.label} className="items-center">
                <ThemedText weight="bold" size="2xl" variant="accent">
                  {stat.value}
                </ThemedText>
                <ThemedText variant="secondary" size="xs" className="mt-1">
                  {stat.label}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* About */}
          <ThemedText
            weight="semibold"
            size="xs"
            variant="muted"
            className="px-4 mb-2 tracking-widest uppercase"
          >
            About
          </ThemedText>
          <View className="p-4 mx-4 border bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-xl">
            <ThemedText variant="secondary" size="sm" className="text-center">
              ET Tracker v{Constants.expoConfig?.version}
              {'\n'}Built with Expo SDK 54 & React Native
            </ThemedText>
            <ThemedText variant="muted" size="xs" className="mt-2 text-center">
              The truth is out there.
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
