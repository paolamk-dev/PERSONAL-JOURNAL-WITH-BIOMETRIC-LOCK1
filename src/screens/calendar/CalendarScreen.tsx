import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../store/settingsStore';
import { useCalendar } from '../../hooks/useCalendar';
import { HomeStackParamList } from '../../types/navigation.types';
import { JournalEntry } from '../../types/entry.types';
import { formatEntryDate } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius } from '../../constants/layout';

type CalendarScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const {
    markedDates,
    selectedDate,
    setSelectedDate,
    getEntriesForDate,
    loading,
  } = useCalendar();

  const selectedDateEntries = getEntriesForDate(selectedDate);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleEntryPress = (entryId: string) => {
    navigation.navigate('EntryDetail', { entryId });
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => {
    const photoCount = item.photos?.length || 0;

    return (
      <TouchableOpacity
        style={[styles.entryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => handleEntryPress(item.id)}
      >
        <View style={styles.entryHeader}>
          <Text style={[styles.entryTitle, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          {item.isFavorite && (
            <Ionicons name="star" size={16} color={theme.accent} />
          )}
        </View>

        <Text style={[styles.entryTime, { color: theme.textSecondary }]}>
          {formatEntryDate(item.createdAt.toDate())}
        </Text>

        <View style={styles.entryFooter}>
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Ionicons name="text" size={14} color={theme.textSecondary} />
              <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
                {item.wordCount} words
              </Text>
            </View>
            {photoCount > 0 && (
              <View style={styles.metadataItem}>
                <Ionicons name="image" size={14} color={theme.textSecondary} />
                <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
                  {photoCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color={theme.textSecondary} />
      <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
        No entries for this date
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
        Select a marked date to view entries
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Calendar</Text>
      </View>

      {/* Calendar */}
      <Calendar
        current={selectedDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: theme.primary,
          },
        }}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: theme.background,
          calendarBackground: theme.background,
          textSectionTitleColor: theme.textSecondary,
          selectedDayBackgroundColor: theme.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.primary,
          dayTextColor: theme.text,
          textDisabledColor: theme.textSecondary,
          dotColor: theme.primary,
          selectedDotColor: '#ffffff',
          arrowColor: theme.primary,
          monthTextColor: theme.text,
          indicatorColor: theme.primary,
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      {/* Entries List */}
      <View style={styles.entriesSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Entries on {new Date(selectedDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>

        <FlatList
          data={selectedDateEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  entriesSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  listContent: {
    flexGrow: 1,
  },
  entryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  entryTime: {
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metadataRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metadataText: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: spacing.sm,
  },
});
