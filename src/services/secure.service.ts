import * as SecureStore from 'expo-secure-store';

const PIN_HASH_KEY = 'biodiary_pin_hash';
const ENCRYPTION_KEY = 'biodiary_encryption_key';

export const storePINHash = async (hash: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
  } catch (error) {
    console.error('Error storing PIN hash:', error);
    throw new Error('Failed to store PIN hash');
  }
};

export const getPINHash = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(PIN_HASH_KEY);
  } catch (error) {
    console.error('Error retrieving PIN hash:', error);
    return null;
  }
};

export const clearPINHash = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(PIN_HASH_KEY);
  } catch (error) {
    console.error('Error clearing PIN hash:', error);
    throw new Error('Failed to clear PIN hash');
  }
};

export const storeEncryptionKey = async (key: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ENCRYPTION_KEY, key);
  } catch (error) {
    console.error('Error storing encryption key:', error);
    throw new Error('Failed to store encryption key');
  }
};

export const getEncryptionKey = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ENCRYPTION_KEY);
  } catch (error) {
    console.error('Error retrieving encryption key:', error);
    return null;
  }
};
