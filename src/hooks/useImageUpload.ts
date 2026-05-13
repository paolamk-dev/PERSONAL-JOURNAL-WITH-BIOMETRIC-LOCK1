import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '../utils/imageUtils';
import { uploadImage } from '../services/storage.service';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async (
    source: 'camera' | 'library'
  ): Promise<string | null> => {
    try {
      let result;

      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setError('Camera permission is required');
          return null;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          setError('Photo library permission is required');
          return null;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (err: any) {
      console.error('Error picking image:', err);
      setError(err.message || 'Failed to pick image');
      return null;
    }
  };

  const uploadToSupabase = async (
    userId: string,
    entryId: string,
    photoId: string,
    uri: string
  ): Promise<string | null> => {
    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      // Compress image first
      setProgress(30);
      const compressedUri = await compressImage(uri);

      // Upload to Supabase
      setProgress(60);
      const publicUrl = await uploadImage(userId, entryId, photoId, compressedUri);

      setProgress(100);
      return publicUrl;
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    pickImage,
    uploadToSupabase,
    isUploading,
    progress,
    error,
  };
};
