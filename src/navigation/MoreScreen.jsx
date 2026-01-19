import { StyleSheet, Text, View, SafeAreaView, Switch, TouchableOpacity, Alert, Linking, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { syncNotificationSettings } from '../utils/notificationUtils'
import { useFocusEffect } from '@react-navigation/native'
import CommonHeader from '../components/CommonHeader';

const MoreScreen = () => {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Load notification preference from storage on component mount
  useEffect(() => {
    const initializeNotifications = async () => {
      await loadNotificationPreferences();
      await syncNotificationSettings();
      await checkNotificationPermission();
    };
    
    initializeNotifications();
  }, []);

  // Check permissions when screen comes into focus (e.g., returning from settings)
  useFocusEffect(
    React.useCallback(() => {
      const checkPermissionsOnFocus = async () => {
        await syncNotificationSettings();
        await checkNotificationPermission();
      };
      
      checkPermissionsOnFocus();
    }, [])
  );

  const loadNotificationPreferences = async () => {
    try {
      const pushValue = await AsyncStorage.getItem('pushNotificationsEnabled');
      const soundValue = await AsyncStorage.getItem('notificationSoundEnabled');
      const vibrationValue = await AsyncStorage.getItem('notificationVibrationEnabled');
      
      if (pushValue !== null) {
        setPushNotificationsEnabled(JSON.parse(pushValue));
      }
      if (soundValue !== null) {
        setSoundEnabled(JSON.parse(soundValue));
      }
      if (vibrationValue !== null) {
        setVibrationEnabled(JSON.parse(vibrationValue));
      }
    } catch (error) {
      console.log('Error loading notification preferences:', error);
    }
  };

  const checkNotificationPermission = async () => {
    try {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      // Update local setting based on actual system permission
      if (!enabled) {
        setPushNotificationsEnabled(false);
        saveNotificationPreference('pushNotificationsEnabled', false);
      } else {
        // Check if user had manually disabled it in our app
        const localSetting = await AsyncStorage.getItem('pushNotificationsEnabled');
        if (localSetting === 'false') {
          setPushNotificationsEnabled(false);
        } else {
          setPushNotificationsEnabled(true);
          saveNotificationPreference('pushNotificationsEnabled', true);
        }
      }
    } catch (error) {
      console.log('Error checking notification permission:', error);
    }
  };

  const promptForNotificationPermission = async () => {
    try {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        Alert.alert(
          'Enable Notifications',
          'Stay updated with important notifications from HisabKitab. Would you like to enable notifications?',
          [
            {
              text: 'Not Now',
              style: 'cancel',
              onPress: () => {
                setPushNotificationsEnabled(false);
                saveNotificationPreference('pushNotificationsEnabled', false);
              }
            },
            {
              text: 'Enable',
              onPress: async () => {
                const requestStatus = await messaging().requestPermission();
                const permissionGranted =
                  requestStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                  requestStatus === messaging.AuthorizationStatus.PROVISIONAL;

                if (permissionGranted) {
                  setPushNotificationsEnabled(true);
                  saveNotificationPreference('pushNotificationsEnabled', true);
                  await messaging().subscribeToTopic('all');
                } else {
                  setPushNotificationsEnabled(false);
                  saveNotificationPreference('pushNotificationsEnabled', false);
                  // Show settings dialog
                  Alert.alert(
                    'Permission Required',
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
      }
    } catch (error) {
      console.log('Error prompting for notification permission:', error);
    }
  };

  const saveNotificationPreference = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Error saving notification preference:', error);
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    saveNotificationPreference('notificationSoundEnabled', newValue);
  };

  const toggleVibration = () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    saveNotificationPreference('notificationVibrationEnabled', newValue);
  };

  const togglePushNotifications = async () => {
    const newValue = !pushNotificationsEnabled;
    
    if (newValue) {
      // If enabling notifications, request permission
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          setPushNotificationsEnabled(true);
          saveNotificationPreference('pushNotificationsEnabled', true);
          
          // Subscribe to topics if needed
          await messaging().subscribeToTopic('all');
          
          Alert.alert(
            'Push Notifications',
            'Push notifications enabled successfully!',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'To enable notifications, please go to your device settings and allow notifications for HisabKitab.',
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
      } catch (error) {
        console.log('Error requesting notification permission:', error);
        Alert.alert(
          'Error',
          'Failed to enable notifications. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // If disabling notifications, guide user to system settings
      Alert.alert(
        'Disable Notifications',
        'To completely disable notifications, you need to turn them off in your device settings. Would you like to open settings now?',
        [
          {
            text: 'Disable in App Only',
            onPress: async () => {
              try {
                await messaging().unsubscribeFromTopic('all');
                setPushNotificationsEnabled(false);
                saveNotificationPreference('pushNotificationsEnabled', false);
                
                Alert.alert(
                  'Notifications Disabled',
                  'Notifications disabled in app. For complete system-level disabling, please use device settings.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                console.log('Error disabling notifications:', error);
                setPushNotificationsEnabled(false);
                saveNotificationPreference('pushNotificationsEnabled', false);
              }
            }
          },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'android') {
                Linking.openSettings();
              } else {
                Linking.openURL('app-settings:');
              }
              // Also disable in app
              setPushNotificationsEnabled(false);
              saveNotificationPreference('pushNotificationsEnabled', false);
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="More" onEditPress={() => console.log('Edit pressed')} />
      <View style={styles.content}>
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={togglePushNotifications}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications for important updates
              </Text>
            </View>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={togglePushNotifications}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={pushNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={[styles.settingItem, !pushNotificationsEnabled && styles.disabledSetting]} 
            onPress={pushNotificationsEnabled ? toggleSound : null}
            disabled={!pushNotificationsEnabled}
          >
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, !pushNotificationsEnabled && styles.disabledText]}>
                Notification Sound
              </Text>
              <Text style={[styles.settingDescription, !pushNotificationsEnabled && styles.disabledText]}>
                Play sound when receiving notifications
              </Text>
            </View>
            <Switch
              value={soundEnabled && pushNotificationsEnabled}
              onValueChange={toggleSound}
              disabled={!pushNotificationsEnabled}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={soundEnabled && pushNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={[styles.settingItem, !pushNotificationsEnabled && styles.disabledSetting]} 
            onPress={pushNotificationsEnabled ? toggleVibration : null}
            disabled={!pushNotificationsEnabled}
          >
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, !pushNotificationsEnabled && styles.disabledText]}>
                Vibration
              </Text>
              <Text style={[styles.settingDescription, !pushNotificationsEnabled && styles.disabledText]}>
                Vibrate when receiving notifications
              </Text>
            </View>
            <Switch
              value={vibrationEnabled && pushNotificationsEnabled}
              onValueChange={toggleVibration}
              disabled={!pushNotificationsEnabled}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={vibrationEnabled && pushNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#e0e0e0"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MoreScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  settingsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  disabledSetting: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
})