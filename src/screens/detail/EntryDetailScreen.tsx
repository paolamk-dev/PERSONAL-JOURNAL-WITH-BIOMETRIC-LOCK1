import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import { getEntries, deleteEntry } from '../../services/entry.service';
import { JournalEntry } from '../../types/entry.types';
import { formatEntryDate } from '../../utils/dateUtils';
import { spacing, borderRadius } from '../../constants/layout';
import { HomeStackParamList } from '../../types/navigation.types';

type EntryDetailScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'EntryDetail'>;
type EntryDetailScreenRouteProp = RouteProp<HomeStackParamList, 'EntryDetail'>;

export const EntryDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<EntryDetailScreenNavigationProp>();
  const route = useRoute<EntryDetailScreenRouteProp>();
  const params = route.params;

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [params.entryId]);

  const loadEntry = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const entries = await getEntries(user.uid);
      const foundEntry = entries.find((e) => e.id === params.entryId);
      
      if (foundEntry) {
        setEntry(foundEntry);
      } else {
        Alert.alert('Error', 'Entry not found');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load entry');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EntryEditor', { entryId: params.entryId });
  };

  const handleDelete = () => {
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
              await deleteEntry(user.uid, params.entryId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const getMoodEmoji = () => {
    if (!entry?.mood) return null;
    const moodMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      neutral: '😐',
      anxious: '😰',
      excited: '🤩',
    };
    return moodMap[entry.mood];
  };

  const readingTime = entry ? Math.ceil(entry.wordCount / 200) : 0;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!entry) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          Entry not found
        </Text>
      </View>
    );
  }

  const moodEmoji = getMoodEmoji();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleEdit} style={styles.headerAction}>
            <Ionicons name="create-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.headerAction}>
            <Ionicons name="trash-outline" size={24} color={theme.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatEntryDate(entry.createdAt.toDate())}
          </Text>
          <View style={styles.metadataRow}>
            {entry.isFavorite && (
              <View style={styles.badge}>
                <Ionicons name="star" size={14} color={theme.accent} />
                <Text style={[styles.badgeText, { color: theme.accent }]}>Favorite</Text>
              </View>
            )}
            <Text style={[styles.readingTime, { color: theme.textSecondary }]}>
              {readingTime} min read
            </Text>
          </View>
        </View>

        {/* Mood */}
        {moodEmoji && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{moodEmoji}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={[styles.title, { color: theme.text }]}>{entry.title}</Text>

        {/* Body */}
        <Text style={[styles.body, { color: theme.text }]}>{entry.body}</Text>

        {/* Word Count */}
        <View style={styles.footer}>
          <Text style={[styles.wordCount, { color: theme.textSecondary }]}>
            {entry.wordCount} words
          </Text>
        </View>
      </ScrollView>
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
  errorText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerAction: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  metadata: {
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  date: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  readingTime: {
    fontSize: 12,
  },
  moodContainer: {
    marginBottom: spacing.md,
  },
  moodEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    lineHeight: 36,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  wordCount: {
    fontSize: 12,
  },
});
