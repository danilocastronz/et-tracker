import { Pressable, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { usePreferences } from '@/hooks/usePreferences';
import { useSightingsContext } from '@/context/SightingsContext';
import { scheduleDailyReminder, cancelAllNotifications } from '@/lib/notifications';

export default function ProfileScreen() {
  const { preferences, loading, updatePreferences } = usePreferences();
  const { sightings } = useSightingsContext();

  async function handleNotificationToggle(enabled: boolean) {
    await updatePreferences({ notificationsEnabled: enabled });
    if (enabled) {
      const [hour, minute] = preferences.dailyReminderTime.split(':').map(Number);
      await scheduleDailyReminder(hour, minute);
    } else {
      await cancelAllNotifications();
    }
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
        >
          {/* Profile Header */}
          <View className="items-center pt-8 pb-6">
            <View className="w-20 h-20 rounded-full bg-[#1A1A35] items-center justify-center mb-3 border-2 border-[#2A2A4A]">
              <ThemedText size="4xl">👽</ThemedText>
            </View>
            <ThemedText weight="bold" size="xl">Field Agent</ThemedText>
            <ThemedText variant="secondary" size="sm" className="mt-1">
              {sightings.length} sighting{sightings.length !== 1 ? 's' : ''} logged
            </ThemedText>
          </View>

          {/* Stats */}
          <View className="mx-4 bg-[#1A1A35] rounded-xl p-4 mb-6 flex-row justify-around">
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

          {/* Settings */}
          <ThemedText
            weight="semibold"
            size="xs"
            variant="muted"
            className="uppercase tracking-widest px-4 mb-2"
          >
            Preferences
          </ThemedText>

          <View className="mx-4 bg-[#1A1A35] rounded-xl overflow-hidden mb-4">
            <SettingRow
              label="Daily Reminders"
              description="Get reminded to log sightings"
              right={
                <Switch
                  value={preferences.notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ false: '#2A2A4A', true: '#00D4FF44' }}
                  thumbColor={preferences.notificationsEnabled ? '#00D4FF' : '#555577'}
                />
              }
            />
            <View className="h-px bg-[#2A2A4A]" />
            <SettingRow
              label="Compact Cards"
              description="Show condensed sighting cards"
              right={
                <Switch
                  value={preferences.showCompactCards}
                  onValueChange={(v) => updatePreferences({ showCompactCards: v })}
                  trackColor={{ false: '#2A2A4A', true: '#00D4FF44' }}
                  thumbColor={preferences.showCompactCards ? '#00D4FF' : '#555577'}
                />
              }
            />
            <View className="h-px bg-[#2A2A4A]" />
            <SettingRow
              label="Map Follows Location"
              description="Center map on your position"
              right={
                <Switch
                  value={preferences.mapFollowsLocation}
                  onValueChange={(v) => updatePreferences({ mapFollowsLocation: v })}
                  trackColor={{ false: '#2A2A4A', true: '#00D4FF44' }}
                  thumbColor={preferences.mapFollowsLocation ? '#00D4FF' : '#555577'}
                />
              }
            />
          </View>

          <ThemedText
            weight="semibold"
            size="xs"
            variant="muted"
            className="uppercase tracking-widest px-4 mb-2"
          >
            About
          </ThemedText>
          <View className="mx-4 bg-[#1A1A35] rounded-xl p-4">
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

function SettingRow({
  label,
  description,
  right,
}: {
  label: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center px-4 py-3">
      <View className="flex-1 mr-3">
        <ThemedText weight="medium" size="sm">{label}</ThemedText>
        {description && (
          <ThemedText variant="muted" size="xs" className="mt-0.5">{description}</ThemedText>
        )}
      </View>
      {right}
    </View>
  );
}
