import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation.types';
import { HomeScreen } from '../screens/home/HomeScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
};
