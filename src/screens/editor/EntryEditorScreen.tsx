import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import { createEntry, updateEntry, getEntries } from '../../services/entry.service';
import { calculateWordCount } from '../../utils/validationUtils';
import { spacing, borderRadius } from '../../constants/layout';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';

export const EntryEditorScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { entryId?: string } | undefined;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const isEditing = !!params?.entryId;
  const wordCount = calculateWordCount(body);

  useEffect(() => {
    if (isEditing && params.entryId) {
      loadEntry(params.entryId);
    }
  }, [params?.entryId]);

  const loadEntry = async (entryId: string) => {
    if (!user) return;

    setFetching(true);
    try {
      const entries = await getEntries(user.uid);
      const entry = entries.find((e) => e.id === entryId);
      
      if (entry) {
        setTitle(entry.title);
        setBody(entry.body);
      } else {
        Alert.alert('Error', 'Entry not found');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load entry');
      navigation.goBack();
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title');
      return;
    }

    if (!body.trim()) {
      Alert.alert('Validation Error', 'Please enter some content');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && params.entryId) {
        await updateEntry(user.uid, params.entryId, {
          title: title.trim(),
          body: body.trim(),
          wordCount,
        });
      } else {
        const entryId = uuidv4();
        await createEntry(user.uid, {
          id: entryId,
          title: title.trim(),
          body: body.trim(),
          mood: null,
          tags: [],
          photos: [],
          wordCount,
        });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || body.trim()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (fetching) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleCancel} disabled={loading}>
          <Text style={[styles.headerButton, { color: theme.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {isEditing ? 'Edit Entry' : 'New Entry'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <Text style={[styles.headerButton, { color: theme.primary }]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <TextInput
          style={[styles.titleInput, { color: theme.text }]}
          placeholder="Give your entry a title..."
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
          editable={!loading}
          autoFocus={!isEditing}
        />

        {/* Body Input */}
        <TextInput
          style={[styles.bodyInput, { color: theme.text }]}
          placeholder="Start writing..."
          placeholderTextColor={theme.textSecondary}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
          editable={!loading}
        />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.wordCount, { color: theme.textSecondary }]}>
          {wordCount} words
        </Text>
      </View>
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: spacing.lg,
  },
  bodyInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 400,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  wordCount: {
    fontSize: 12,
  },
});
