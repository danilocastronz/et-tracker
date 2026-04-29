import { handleNotificationResponse } from '@/lib/notification-handler';
import { setupNotifications } from '@/lib/notifications';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export function useNotifications() {
  useEffect(() => {
    setupNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => subscription.remove();
  }, []);
}
