import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { db } from './firebase-app';

export default async function registerForPushNotificationsAsync() {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  console.log('Sending local notification');
  Notifications.presentLocalNotificationAsync({
    title: 'Wow!',
    body: 'You suck!',
  });
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    // alert('No notification permissions!');
    return;
  }
  const { deviceId } = Constants;
  try {
    const doc = await db.collection('devices').doc(deviceId).get();
    if (!doc.exists) {
      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      await db.collection('devices').doc(deviceId).set({ token: expoPushToken });
    }
  } catch (err) {
    console.log(`An error occurred retrieving devices: ${err.message}`);
  }
}
