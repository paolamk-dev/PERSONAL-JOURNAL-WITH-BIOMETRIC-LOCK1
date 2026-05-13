import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (uri: string): Promise<string> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }], // Resize to max 1200px width, maintaining aspect ratio
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

export const generateImagePath = (userId: string, entryId: string, photoId: string): string => {
  return `${userId}/${entryId}/${photoId}.jpg`;
};
