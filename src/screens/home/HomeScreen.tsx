import React, { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import { useEntries } from '../../hooks/useEntries';
import { groupEntriesByDate } from '../../utils/dateUtils';
import { deleteEntry, toggleFavorite } from '../../services/entry.service';
import { EntryCard } from './components/EntryCard';
import { SectionHeader } from './components/SectionHeader';
import { EmptyState } from './components/EmptyState';
import { spacing, borderRadius } from '../../constants/layout';
import { format } from 'date-fns';
import { HomeStackParamList } from '../../types/navigation.types';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { entries, loading, refreshing, error, refresh } = useEntries();

  const [searchQuery, setSearchQuery] = useState('');

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  // Filter entries by search query
  const filteredEntries = searchQuery.trim()
    ? entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stripHtml(entry.body).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  // Group entries by date
  const groupedEntries = groupEntriesByDate(filteredEntries);

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('EntryDetail', { entryId });
  };

  const handleEditEntry = (entryId: string) => {
    navigation.navigate('EntryEditor', { entryId });
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(user.uid, entryId);
              await refresh();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (entryId: string, currentState: boolean) => {
    if (!user) return;

    try {
      await toggleFavorite(user.uid, entryId, currentState);
      await refresh();
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const handleCreateEntry = () => {
    navigation.navigate('EntryEditor', {});
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appName, { color: theme.text }]}>BioDiary</Text>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            {getGreeting()}, {user?.displayName || 'there'}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.surface,
              color: theme.text,
            },
          ]}
          placeholder="Search entries..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Entry List */}
      {groupedEntries.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        <SectionList
          sections={groupedEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EntryCard
              entry={item}
              onPress={() => handleEntryPress(item.id)}
              onEdit={() => handleEditEntry(item.id)}
              onDelete={() => handleDeleteEntry(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item.id, item.isFavorite)}
            />
          )}
          renderSectionHeader={({ section }) => (
            <SectionHeader title={section.title} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme.primary}
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={handleCreateEntry}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  greeting: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.lg,
    paddingLeft: spacing.xl + spacing.md,
    paddingRight: spacing.xl,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
