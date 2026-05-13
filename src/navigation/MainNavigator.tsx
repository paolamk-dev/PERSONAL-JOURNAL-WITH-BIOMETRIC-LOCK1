import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation.types';
import { HomeStackNavigator } from './HomeStackNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
    </Tab.Navigator>
  );
};
