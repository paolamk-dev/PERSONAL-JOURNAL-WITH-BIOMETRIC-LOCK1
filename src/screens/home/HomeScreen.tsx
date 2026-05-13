import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spacing, borderRadius } from '../../constants/layout';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            // Clear cached entries
            if (user) {
              await AsyncStorage.removeItem(`biodiary_entries_cache_${user.uid}`);
            }
            await signOut();
          } catch (error: any) {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.text }]}>Welcome to BioDiary!</Text>
        <Text style={[styles.subtext, { color: theme.textSecondary }]}>
          You're logged in as {user?.email}
        </Text>
        <Text style={[styles.subtext, { color: theme.textSecondary }]}>
          Phase 4 will implement the journal entry list here
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: theme.danger }]}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  signOutButton: {
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
