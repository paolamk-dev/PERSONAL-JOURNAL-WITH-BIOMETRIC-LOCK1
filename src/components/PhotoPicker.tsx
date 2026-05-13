import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/settingsStore';
import { spacing, borderRadius } from '../constants/layout';

interface PhotoPickerProps {
  onPhotoPicked: (uri: string) => void;
  maxPhotos?: number;
  currentPhotoCount?: number;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  onPhotoPicked,
  maxPhotos = 10,
  currentPhotoCount = 0,
}) => {
  const { theme } = useTheme();
  const [requesting, setRequesting] = useState(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos.'
      );
      return false;
    }
    return true;
  };

  const requestLibraryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Photo library permission is required to select photos.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    try {
      setRequesting(true);
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoPicked(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  const pickFromLibrary = async () => {
    try {
      setRequesting(true);
      const hasPermission = await requestLibraryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoPicked(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick photo. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  const showPicker = () => {
    if (currentPhotoCount >= maxPhotos) {
      Alert.alert(
        'Limit Reached',
        `You can add up to ${maxPhotos} photos per entry.`
      );
      return;
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          } else if (buttonIndex === 2) {
            pickFromLibrary();
          }
        }
      );
    } else {
      Alert.alert(
        'Add Photo',
        'Choose a method to add a photo',
        [
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickFromLibrary },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={showPicker}
      disabled={requesting || currentPhotoCount >= maxPhotos}
    >
      <Ionicons
        name="camera-outline"
        size={24}
        color={currentPhotoCount >= maxPhotos ? theme.textSecondary : theme.primary}
      />
      <Text
        style={[
          styles.buttonText,
          { color: currentPhotoCount >= maxPhotos ? theme.textSecondary : theme.text },
        ]}
      >
        {currentPhotoCount >= maxPhotos ? 'Photo Limit Reached' : 'Add Photo'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
