import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../store/settingsStore';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Home Screen</Text>
      <Text style={[styles.subtext, { color: theme.textSecondary }]}>
        Will be implemented in Phase 4
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
  },
});
