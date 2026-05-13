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
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import { createEntry, updateEntry, getEntries } from '../../services/entry.service';
import { uploadImage, deleteImage } from '../../services/storage.service';
import { calculateWordCount } from '../../utils/validationUtils';
import { spacing, borderRadius } from '../../constants/layout';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import { RichTextEditor } from '../../components/RichTextEditor';
import { PhotoPicker } from '../../components/PhotoPicker';
import { DailyPhoto } from '../../types/entry.types';

export const EntryEditorScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { entryId?: string } | undefined;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState<DailyPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isEditing = !!params?.entryId;
  const entryId = params?.entryId || uuidv4();

  // Helper to strip HTML tags for word count
  const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const wordCount = calculateWordCount(stripHtml(body));

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
        setPhotos(entry.photos);
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

  const handlePhotoPicked = async (uri: string) => {
    if (!user) return;

    setUploading(true);
    try {
      const photoId = uuidv4();
      const url = await uploadImage(user.uid, entryId, photoId, uri);

      const newPhoto: DailyPhoto = {
        id: photoId,
        entryId,
        supabaseUrl: url,
        supabasePath: `${user.uid}/${entryId}/${photoId}.jpg`,
        caption: '',
        uploadedAt: Timestamp.now(),
      };

      setPhotos([...photos, newPhoto]);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    try {
      await deleteImage(photo.supabasePath);
      setPhotos(photos.filter((p) => p.id !== photoId));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete photo. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title');
      return;
    }

    const plainTextBody = stripHtml(body);
    if (!plainTextBody.trim()) {
      Alert.alert('Validation Error', 'Please enter some content');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && params.entryId) {
        await updateEntry(user.uid, params.entryId, {
          title: title.trim(),
          body: body.trim(),
          photos,
          wordCount,
        });
      } else {
        await createEntry(user.uid, {
          id: entryId,
          title: title.trim(),
          body: body.trim(),
          mood: null,
          tags: [],
          photos,
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
    const plainTextBody = stripHtml(body);
    if (title.trim() || plainTextBody.trim()) {
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

      <ScrollView style={styles.scrollContent}>
        {/* Title Input */}
        <View style={[styles.titleContainer, { borderBottomColor: theme.border }]}>
          <TextInput
            style={[styles.titleInput, { color: theme.text }]}
            placeholder="Give your entry a title..."
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
            autoFocus={!isEditing}
          />
        </View>

        {/* Photos Section */}
        <View style={styles.photosSection}>
          <PhotoPicker
            onPhotoPicked={handlePhotoPicked}
            currentPhotoCount={photos.length}
            maxPhotos={10}
          />

          {uploading && (
            <View style={styles.uploadingIndicator}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.uploadingText, { color: theme.textSecondary }]}>
                Uploading photo...
              </Text>
            </View>
          )}

          {photos.length > 0 && (
            <View style={styles.photoGrid}>
              {photos.map((photo) => (
                <View key={photo.id} style={styles.photoItem}>
                  <Image source={{ uri: photo.supabaseUrl }} style={styles.photoThumbnail} />
                  <TouchableOpacity
                    style={[styles.deletePhotoButton, { backgroundColor: theme.danger }]}
                    onPress={() => handleDeletePhoto(photo.id)}
                  >
                    <Ionicons name="close" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Rich Text Editor */}
      <RichTextEditor
        initialContent={body}
        placeholder="Start writing..."
        onContentChange={setBody}
      />

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
  scrollContent: {
    maxHeight: 280,
  },
  titleContainer: {
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: spacing.md,
  },
  photosSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  uploadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  uploadingText: {
    fontSize: 14,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  photoItem: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
