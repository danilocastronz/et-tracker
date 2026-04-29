import * as Notifications from 'expo-notifications';
import { NotificationPayload } from '@/types';
import { router } from 'expo-router';

export function handleNotificationResponse(response: Notifications.NotificationResponse): void {
  const data = response.notification.request.content.data as NotificationPayload;

  if (data.sightingId) {
    router.push(`/sightings/${data.sightingId}`);
    return;
  }
  if (data.species) {
    router.push(`/aliens/${data.species}`);
    return;
  }
  if (data.screen) {
    router.replace(data.screen as never);
    return;
  }

  router.replace('/(tabs)');
}
