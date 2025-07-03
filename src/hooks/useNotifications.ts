import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { KEYS } from '@/lib/i18n';

export async function requestNotificationPermissions() {
  if (Device.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      console.warn('Notification permission not granted');
    }
  }
}

export async function scheduleReplacementNotification(
  /** dirty hack, I'm so sowwy */
  t: any,
  instrumentId: string,
  replacementDate: Date
) {
  const notifKey = `notif_replacement_${instrumentId}`;
  const existingNotifId = await AsyncStorage.getItem(notifKey);

  const threeMonthLater = new Date(replacementDate);
  threeMonthLater.setMonth(replacementDate.getMonth() + 3);

  if (existingNotifId) {
    await Notifications.cancelScheduledNotificationAsync(existingNotifId);
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const newNotifId = await Notifications.scheduleNotificationAsync({
    content: {
      title: t(KEYS.NOTIFICATIONS.LABEL_MONTHS),
      body: t(KEYS.NOTIFICATIONS.SUB_LABEL_MONTHS),
    },
    trigger: {
      date: threeMonthLater,
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  });

  await AsyncStorage.setItem(notifKey, newNotifId);
  await AsyncStorage.removeItem(`notified_100h_${instrumentId}`);
}

export async function send100HoursNotificationOnce(
  t: any,
  instrumentId: string
) {
  const key = `notified_100h_${instrumentId}`;
  const alreadyNotified = await AsyncStorage.getItem(key);
  if (alreadyNotified) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: t(KEYS.NOTIFICATIONS.LABEL_HOURS),
      body: t(KEYS.NOTIFICATIONS.SUB_LABEL_HOURS),
    },
    trigger: null,
  });

  await AsyncStorage.setItem(key, 'true');
}
