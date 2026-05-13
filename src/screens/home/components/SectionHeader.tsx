import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../store/settingsStore';
import { spacing } from '../../../constants/layout';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});
