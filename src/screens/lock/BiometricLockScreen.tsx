import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { useBiometric } from '../../hooks/useBiometric';
import { spacing } from '../../constants/layout';

interface BiometricLockScreenProps {
  onUnlock: () => void;
  onUsePIN: () => void;
}

export const BiometricLockScreen: React.FC<BiometricLockScreenProps> = ({
  onUnlock,
  onUsePIN,
}) => {
  const { theme } = useTheme();
  const { isAvailable, isEnrolled, biometricType, authenticate } = useBiometric();
  const [attemptCount, setAttemptCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    // Auto-trigger biometric authentication on mount
    if (isAvailable && isEnrolled) {
      handleBiometricAuth();
    }
  }, [isAvailable, isEnrolled]);

  const handleBiometricAuth = async () => {
    setError('');
    
    const result = await authenticate('Unlock BioDiary');
    
    if (result.success) {
      onUnlock();
    } else {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      
      if (newAttemptCount >= 3) {
        // After 3 failed attempts, redirect to PIN
        setError('Too many failed attempts. Please use your PIN.');
        setTimeout(() => {
          onUsePIN();
        }, 1500);
      } else {
        setError(result.error || 'Authentication failed. Please try again.');
      }
    }
  };

  const getBiometricIcon = () => {
    if (biometricType === 'faceId') {
      return 'scan';
    }
    return 'finger-print';
  };

  const getBiometricLabel = () => {
    if (biometricType === 'faceId') {
      return 'Face ID';
    }
    return 'Fingerprint';
  };

  if (!isAvailable || !isEnrolled) {
    // If biometric is not available, show fallback
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <Ionicons name="lock-closed" size={64} color={theme.textSecondary} />
          <Text style={[styles.title, { color: theme.text }]}>
            Biometric Not Available
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Please use your PIN to unlock
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={onUsePIN}
        >
          <Text style={styles.buttonText}>Use PIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* App Logo/Name */}
        <Text style={[styles.appName, { color: theme.text }]}>BioDiary</Text>

        {/* Biometric Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name={getBiometricIcon()} size={64} color={theme.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text }]}>
          Unlock with {getBiometricLabel()}
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Authenticate to access your journal
        </Text>

        {/* Error Message */}
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.danger + '15' }]}>
            <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          </View>
        ) : null}

        {/* Retry Button */}
        {attemptCount > 0 && attemptCount < 3 ? (
          <TouchableOpacity
            style={[styles.retryButton, { borderColor: theme.primary }]}
            onPress={handleBiometricAuth}
          >
            <Text style={[styles.retryButtonText, { color: theme.primary }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Use PIN Button */}
      <TouchableOpacity style={styles.usePinButton} onPress={onUsePIN}>
        <Text style={[styles.usePinText, { color: theme.primary }]}>Use PIN instead</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: spacing['2xl'],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginTop: spacing.lg,
    maxWidth: '90%',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: spacing.lg,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  usePinButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  usePinText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
