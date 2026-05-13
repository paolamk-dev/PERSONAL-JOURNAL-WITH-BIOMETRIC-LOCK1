import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/settingsStore';
import { spacing, borderRadius } from '../constants/layout';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const THUMBNAIL_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2) / 3;

interface Photo {
  id: string;
  supabaseUrl?: string;
  url?: string;
  supabasePath: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onDeletePhoto?: (supabasePath: string) => void;
  editable?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onDeletePhoto,
  editable = false,
}) => {
  const { theme } = useTheme();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
  };

  const handleDeletePhoto = () => {
    if (selectedPhotoIndex === null || !onDeletePhoto) return;

    const photo = photos[selectedPhotoIndex];
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeletePhoto(photo.supabasePath);
            handleCloseModal();
          },
        },
      ]
    );
  };

  if (photos.length === 0) {
    return null;
  }

  const getPhotoUrl = (photo: Photo) => photo.url || photo.supabaseUrl || '';

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={photo.id}
            style={styles.thumbnail}
            onPress={() => handlePhotoPress(index)}
          >
            <Image
              source={{ uri: getPhotoUrl(photo) }}
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

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
            {editable && onDeletePhoto && (
              <TouchableOpacity onPress={handleDeletePhoto} style={styles.modalButton}>
                <Ionicons name="trash-outline" size={24} color="#ff4444" />
              </TouchableOpacity>
            )}
          </View>

          {/* Photo Viewer */}
          {selectedPhotoIndex !== null && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.photoScroller}
              contentOffset={{ x: selectedPhotoIndex * SCREEN_WIDTH, y: 0 }}
            >
              {photos.map((photo, index) => (
                <View key={photo.id} style={styles.photoContainer}>
                  <Image
                    source={{ uri: getPhotoUrl(photo) }}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
          )}

          {/* Photo Counter */}
          {selectedPhotoIndex !== null && photos.length > 1 && (
            <View style={styles.counterContainer}>
              <View style={styles.counter}>
                <Ionicons name="images-outline" size={16} color="#ffffff" />
                <Text style={styles.counterText}>
                  {selectedPhotoIndex + 1} / {photos.length}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
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
    height: SCREEN_HEIGHT - 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 120,
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
