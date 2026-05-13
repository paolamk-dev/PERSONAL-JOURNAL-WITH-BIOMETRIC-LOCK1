import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActionSheetIOS, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../store/settingsStore';
import { JournalEntry } from '../../../types/entry.types';
import { formatEntryDate } from '../../../utils/dateUtils';
import { getPreviewText } from '../../../utils/validationUtils';
import { spacing, borderRadius } from '../../../constants/layout';

interface EntryCardProps {
  entry: JournalEntry;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onPress,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const { theme } = useTheme();

  const getMoodEmoji = () => {
    const moodMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      neutral: '😐',
      anxious: '😰',
      excited: '🤩',
    };
    return entry.mood ? moodMap[entry.mood] : null;
  };

  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const handleLongPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Cancel',
            'Edit',
            'Delete',
            entry.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
          ],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            onEdit();
          } else if (buttonIndex === 2) {
            onDelete();
          } else if (buttonIndex === 3) {
            onToggleFavorite();
          }
        }
      );
    } else {
      Alert.alert(
        'Entry Options',
        'Choose an action',
        [
          { text: 'Edit', onPress: onEdit },
          { text: 'Delete', onPress: onDelete, style: 'destructive' },
          {
            text: entry.isFavorite ? 'Remove from Favorites' : 'Add to Favorites',
            onPress: onToggleFavorite,
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const moodEmoji = getMoodEmoji();
  const plainTextBody = stripHtml(entry.body);
  const preview = getPreviewText(plainTextBody, 100);
  const photoCount = entry.photos.length;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.surface, shadowColor: theme.cardShadow },
      ]}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {moodEmoji && <Text style={styles.moodEmoji}>{moodEmoji}</Text>}
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {entry.title}
          </Text>
        </View>
        {entry.isFavorite && (
          <Ionicons name="star" size={20} color={theme.accent} />
        )}
      </View>

      <Text
        style={[styles.preview, { color: theme.textSecondary }]}
        numberOfLines={3}
      >
        {preview}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {formatEntryDate(entry.createdAt.toDate())}
        </Text>
        <View style={styles.metadata}>
          {photoCount > 0 && (
            <View style={styles.metadataItem}>
              <Ionicons name="image" size={14} color={theme.textSecondary} />
              <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
                {photoCount}
              </Text>
            </View>
          )}
          <View style={styles.metadataItem}>
            <Ionicons name="text" size={14} color={theme.textSecondary} />
            <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
              {entry.wordCount}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  metadata: {
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
});
