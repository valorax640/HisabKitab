import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const checkAndPromptForNotifications = async () => {
  try {
    // Check if we've already prompted today
    const lastPromptDate = await AsyncStorage.getItem('lastNotificationPrompt');
    const today = new Date().toDateString();
    
    if (lastPromptDate === today) {
      return; // Already prompted today
    }

    // Check current notification permission status
    const authStatus = await messaging().hasPermission();
    const systemEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // Check app-level setting
    const appSetting = await AsyncStorage.getItem('pushNotificationsEnabled');
    const appEnabled = appSetting !== 'false';

    // Only prompt if notifications are disabled at system level but user hasn't explicitly disabled in app
    if (!systemEnabled && appEnabled) {
      setTimeout(() => {
        Alert.alert(
          'Enable Notifications',
          'Stay updated with important information from HisabKitab. Enable notifications to get timely updates about your transactions and account activities.',
          [
            {
              text: 'Not Now',
              style: 'cancel',
              onPress: async () => {
                await AsyncStorage.setItem('lastNotificationPrompt', today);
                await AsyncStorage.setItem('pushNotificationsEnabled', 'false');
              }
            },
            {
              text: 'Enable',
              onPress: async () => {
                await AsyncStorage.setItem('lastNotificationPrompt', today);
                
                const requestStatus = await messaging().requestPermission();
                const permissionGranted =
                  requestStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                  requestStatus === messaging.AuthorizationStatus.PROVISIONAL;

                if (permissionGranted) {
                  await AsyncStorage.setItem('pushNotificationsEnabled', 'true');
                  await messaging().subscribeToTopic('all');
                  
                  Alert.alert(
                    'Notifications Enabled',
                    'You will now receive important updates from HisabKitab.',
                    [{ text: 'OK' }]
                  );
                } else {
                  // Permission denied, guide to settings
                  Alert.alert(
                    'Enable in Settings',
                    'To receive notifications, please enable them in your device settings.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Open Settings', 
                        onPress: () => {
                          if (Platform.OS === 'android') {
                            Linking.openSettings();
                          } else {
                            Linking.openURL('app-settings:');
                          }
                        }
                      }
                    ]
                  );
                }
              }
            }
          ]
        );
      }, 2000); // Delay to let the app load completely
    }
  } catch (error) {
    console.log('Error checking notification permissions:', error);
  }
};

export const syncNotificationSettings = async () => {
  try {
    const authStatus = await messaging().hasPermission();
    const systemEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // Update app setting based on system permission
    if (!systemEnabled) {
      await AsyncStorage.setItem('pushNotificationsEnabled', 'false');
    }
    
    return systemEnabled;
  } catch (error) {
    console.log('Error syncing notification settings:', error);
    return false;
  }
};