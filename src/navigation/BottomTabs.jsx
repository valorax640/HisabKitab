import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import PartiesScreen from './PartiesScreen';
import BillsScreen from './BillsScreen';
import ItemsScreen from './ItemsScreen';
import MoreScreen from './MoreScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Parties':
              iconName = 'people';
              break;
            case 'Bills':
              iconName = 'receipt';
              break;
            case 'Items':
              iconName = 'inventory';
              break;
            case 'More':
              iconName = 'menu';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#388e3c',
        tabBarInactiveTintColor: '#555',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Parties" component={PartiesScreen} />
      <Tab.Screen name="Bills" component={BillsScreen} />
      <Tab.Screen name="Items" component={ItemsScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
