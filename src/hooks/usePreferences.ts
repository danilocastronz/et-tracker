import { loadPreferences, savePreferences } from '@/lib/preferences';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UserPreferences } from '@/types';

const DEFAULT_PREFERENCES: UserPreferences = {
  notificationsEnabled: true,
  dailyReminderTime: '20:00',
  defaultThreatFilter: 'all',
  showCompactCards: false,
  mapFollowsLocation: true,
  displayName: 'Field Agent',
  avatarUri: undefined,
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    loadPreferences().then((prefs) => {
      if (mountedRef.current) {
        setPreferences(prefs);
        setLoading(false);
      }
    });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      const optimistic = { ...preferences, ...updates };
      setPreferences(optimistic);
      await savePreferences(updates);
    },
    [preferences]
  );

  return { preferences, loading, updatePreferences };
}
