import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntryScreen from './src/screens/EntryScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/OtpScreen';
import BottomTabs from './src/navigation/BottomTabs';
// import DashboardTabs from './src/navigation/DashboardTabs';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(''); // null = loading

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setInitialRoute("Dashboard");
        } else {
          setInitialRoute('Dashboard');
        }
      } catch (e) {
        setInitialRoute('Dashboard');
      }
    };
    checkToken();
  }, []);

  if (initialRoute === '') {
    // Loading screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Dashboard" component={BottomTabs} />
        {/* <Stack.Screen name="Dashboard" component={DashboardTabs} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
