import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { ImageDetailScreen } from '../screens/Main/ImageDetailScreen';
import { useAuthStore } from '../store/useAuthStore';
import { RootStackParamList } from '../types/navigation';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, loadSession } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      await loadSession();
      setLoading(false);
    };
    initSession();
  }, [loadSession]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen 
              name="ImageDetail" 
              component={ImageDetailScreen} 
              options={{ 
                headerShown: true, 
                title: '', 
                headerTransparent: true,
                headerTintColor: '#FFF',
                headerBackTitleVisible: false,
              }} 
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
