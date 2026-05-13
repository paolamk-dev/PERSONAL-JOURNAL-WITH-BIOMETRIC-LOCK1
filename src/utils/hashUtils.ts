import * as Crypto from 'expo-crypto';

export const hashPIN = async (pin: string): Promise<string> => {
  try {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pin
    );
    return hash;
  } catch (error) {
    console.error('Error hashing PIN:', error);
    throw new Error('Failed to hash PIN');
  }
};

export const verifyPIN = async (inputPIN: string, storedHash: string): Promise<boolean> => {
  try {
    const inputHash = await hashPIN(inputPIN);
    return inputHash === storedHash;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
};
