import { supabase } from '../config/supabase';
import { SUPABASE_BUCKET_NAME } from '../config/env';
import * as FileSystem from 'expo-file-system';

export const uploadImage = async (
  userId: string,
  entryId: string,
  photoId: string,
  fileUri: string,
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  try {
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // Build storage path
    const extension = mimeType.split('/')[1] || 'jpg';
    const filePath = `${userId}/${entryId}/${photoId}.${extension}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (supabasePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .remove([supabasePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

export const getSignedUrl = async (supabasePath: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .createSignedUrl(supabasePath, 3600); // 1 hour expiry

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw new Error('Failed to get signed URL');
  }
};
