import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/Main/HomeScreen';
import { FavoritesScreen } from '../screens/Main/FavoritesScreen';
import { ProfileScreen } from '../screens/Main/ProfileScreen';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E1E1E',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
