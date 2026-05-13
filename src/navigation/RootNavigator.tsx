import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../store/settingsStore';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
        ) : (
          <Stack.Screen name="MainPlaceholder" component={PlaceholderScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const PlaceholderScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[styles.centered, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        BioDiary
      </Text>
      <Text style={[styles.subtext, { color: theme.textSecondary }]}>
        {user ? 'Logged in' : 'Not logged in'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
  },
});
