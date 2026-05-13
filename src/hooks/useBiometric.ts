import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { IS_DEV_MOCK_BIOMETRIC } from '../config/env';

export interface BiometricResult {
  success: boolean;
  error?: string;
}

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricType, setBiometricType] = useState<'faceId' | 'fingerprint' | 'iris' | null>(
    null
  );

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      if (IS_DEV_MOCK_BIOMETRIC) {
        setIsAvailable(true);
        setIsEnrolled(true);
        setBiometricType('fingerprint');
        return;
      }

      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsAvailable(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        if (enrolled) {
          const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            setBiometricType('faceId');
          } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            setBiometricType('fingerprint');
          } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
            setBiometricType('iris');
          }
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const authenticate = async (
    promptMessage: string = 'Authenticate to continue'
  ): Promise<BiometricResult> => {
    try {
      if (IS_DEV_MOCK_BIOMETRIC) {
        return { success: true };
      }

      if (!isAvailable || !isEnrolled) {
        return { success: false, error: 'Biometric authentication not available' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: true,
      });

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: 'Authentication failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Authentication error' };
    }
  };

  return {
    isAvailable,
    isEnrolled,
    biometricType,
    authenticate,
  };
};
