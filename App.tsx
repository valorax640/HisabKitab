import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntryScreen from './src/screens/EntryScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/OtpScreen';
import ContactList from './src/screens/ContactList';
import AddCustomer from './src/screens/AddCustomer';
import CustomerDetailsScreen from './src/screens/CustomerDetailsScreen';
import Calculator from './src/screens/Calculator';
import BottomTabs from './src/navigation/BottomTabs';
import { ActivityIndicator, View } from 'react-native';
import ConnectionWrapper from './src/components/ConnectionWrapper';
import { setNavigationRef, requestUserPermission, NotificationListener } from './src/FirebaseNotification';

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
          setInitialRoute('Calculator');
        }
      } catch (e) {
        setInitialRoute('CustomerDetailsScreen');
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    requestUserPermission();
    NotificationListener();
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
    <NavigationContainer ref={(ref) => { setNavigationRef(ref) }}>
      <ConnectionWrapper>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Entry" component={EntryScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
          <Stack.Screen name="Dashboard" component={BottomTabs} />
          <Stack.Screen name="ContactList" component={ContactList} />
          <Stack.Screen name="AddCustomer" component={AddCustomer} />
          <Stack.Screen name="CustomerDetailsScreen" component={CustomerDetailsScreen} />
          <Stack.Screen name="Calculator" component={Calculator} />
        </Stack.Navigator>
      </ConnectionWrapper>
    </NavigationContainer>
  );
}
