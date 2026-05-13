import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import { getEntries } from '../../services/entry.service';
import { DailyPhoto, JournalEntry } from '../../types/entry.types';
import { format } from 'date-fns';
import { spacing, borderRadius } from '../../constants/layout';
import { HomeStackParamList } from '../../types/navigation.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2) / 3;

interface PhotoWithEntry {
  photo: DailyPhoto;
  entry: JournalEntry;
}

type GalleryScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

export const GalleryScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<GalleryScreenNavigationProp>();

  const [photos, setPhotos] = useState<PhotoWithEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [user]);

  const loadPhotos = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const entries = await getEntries(user.uid);
      
      const allPhotos: PhotoWithEntry[] = [];
      entries.forEach((entry) => {
        entry.photos.forEach((photo) => {
          allPhotos.push({ photo, entry });
        });
      });

      // Sort by upload date, newest first
      allPhotos.sort((a, b) => 
        b.photo.uploadedAt.toMillis() - a.photo.uploadedAt.toMillis()
      );

      setPhotos(allPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  const handleViewEntry = () => {
    if (selectedPhotoIndex === null) return;
    const photoWithEntry = photos[selectedPhotoIndex];
    handleCloseModal();
    navigation.navigate('EntryDetail', { entryId: photoWithEntry.entry.id });
  };

  const renderPhoto = ({ item, index }: { item: PhotoWithEntry; index: number }) => {
    const dateStr = format(item.entry.createdAt.toDate(), 'MMM d, yyyy');

    return (
      <TouchableOpacity
        style={styles.photoItem}
        onPress={() => handlePhotoPress(index)}
      >
        <Image
          source={{ uri: item.photo.supabaseUrl }}
          style={styles.photoImage}
          resizeMode="cover"
        />
        <View style={[styles.dateChip, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="images-outline" size={64} color={theme.textSecondary} />
      <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
        No photos yet
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
        Photos you add to your entries will appear here
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

  const selectedPhotoWithEntry = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Gallery</Text>
        {photos.length > 0 && (
          <Text style={[styles.photoCount, { color: theme.textSecondary }]}>
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </Text>
        )}
      </View>

      {/* Photo Grid */}
      <FlatList
        data={photos}
        keyExtractor={(item, index) => `${item.photo.id}-${index}`}
        renderItem={renderPhoto}
        numColumns={3}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={photos.length === 0 ? styles.emptyContainer : styles.listContent}
        columnWrapperStyle={photos.length > 0 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
      />

      {/* Full Screen Photo Modal */}
      <Modal
        visible={selectedPhotoIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.95)' }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleViewEntry} style={styles.modalButton}>
              <Ionicons name="document-text-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Photo Viewer */}
          {selectedPhotoWithEntry && (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.photoScroller}
                contentOffset={{ x: selectedPhotoIndex! * SCREEN_WIDTH, y: 0 }}
                onScroll={(event) => {
                  const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  if (newIndex !== selectedPhotoIndex) {
                    setSelectedPhotoIndex(newIndex);
                  }
                }}
                scrollEventThrottle={16}
              >
                {photos.map((photoWithEntry, index) => (
                  <View key={`${photoWithEntry.photo.id}-${index}`} style={styles.photoContainer}>
                    <Image
                      source={{ uri: photoWithEntry.photo.supabaseUrl }}
                      style={styles.fullImage}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Photo Info */}
              <View style={styles.photoInfo}>
                <Text style={styles.entryTitle} numberOfLines={1}>
                  {selectedPhotoWithEntry.entry.title}
                </Text>
                <Text style={styles.entryDate}>
                  {format(selectedPhotoWithEntry.entry.createdAt.toDate(), 'MMMM d, yyyy')}
                </Text>
              </View>

              {/* Photo Counter */}
              {photos.length > 1 && (
                <View style={styles.counterContainer}>
                  <View style={styles.counter}>
                    <Ionicons name="images-outline" size={16} color="#ffffff" />
                    <Text style={styles.counterText}>
                      {selectedPhotoIndex! + 1} / {photos.length}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  photoCount: {
    fontSize: 14,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  dateChip: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
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
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.md,
  },
  modalButton: {
    padding: spacing.sm,
  },
  photoScroller: {
    flex: 1,
  },
  photoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
  },
  photoInfo: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  entryTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  entryDate: {
    color: '#cccccc',
    fontSize: 14,
  },
  counterContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  counterText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
