import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';

let navigationRef = null;
export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken(); // fetch token if permission granted
        await messaging().subscribeToTopic('all');
    }
};

const getFcmToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
};

export const NotificationListener = () => {
    // When app is in foreground
    messaging().onMessage(async remoteMessage => {
        Alert.alert('New Notification', remoteMessage.notification?.title);
        console.log('A new FCM message arrived!', remoteMessage);
    });

    // When app is in background and opened by tapping notification
    messaging().onNotificationOpenedApp(remoteMessage => {
        const screen = remoteMessage.data?.screen;
        if (screen && navigationRef) {
            navigationRef.navigate(screen);
        }
    });

    // When app is opened from a quit state
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            const screen = remoteMessage?.data?.screen;
            if (screen && navigationRef) {
                navigationRef.navigate(screen);
            }
        });
};
