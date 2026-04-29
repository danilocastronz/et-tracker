import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { setupNotifications } from '@/lib/notifications';
import { handleNotificationResponse } from '@/lib/notification-handler';

export function useNotifications() {
  useEffect(() => {
    setupNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => subscription.remove();
  }, []);
}
