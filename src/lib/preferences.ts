import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '@/types';

const PREFERENCES_KEY = 'user_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  notificationsEnabled: true,
  dailyReminderTime: '20:00',
  defaultThreatFilter: 'all',
  showCompactCards: false,
  mapFollowsLocation: true,
  displayName: 'Field Agent',
  avatarUri: undefined,
};

export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const saved = JSON.parse(raw) as Partial<UserPreferences>;
    return { ...DEFAULT_PREFERENCES, ...saved };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
  const current = await loadPreferences();
  const merged = { ...current, ...prefs };
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(merged));
}

export async function clearPreferences(): Promise<void> {
  await AsyncStorage.removeItem(PREFERENCES_KEY);
}
