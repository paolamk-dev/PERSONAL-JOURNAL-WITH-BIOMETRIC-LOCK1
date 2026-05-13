import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { usePIN } from '../../hooks/usePIN';
import { spacing } from '../../constants/layout';

interface PINLockScreenProps {
  onUnlock: () => void;
  mode?: 'verify' | 'create' | 'change';
  onPINCreated?: () => void;
}

export const PINLockScreen: React.FC<PINLockScreenProps> = ({
  onUnlock,
  mode = 'verify',
  onPINCreated,
}) => {
  const { theme } = useTheme();
  const { setPIN, verifyPIN } = usePIN();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setTimeout(() => {
        setLockoutTime(lockoutTime - 1);
      }, 1000);
    } else if (lockoutTime === 0 && attemptCount >= 5) {
      setAttemptCount(0);
    }
    return () => clearTimeout(timer);
  }, [lockoutTime, attemptCount]);

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleNumberPress = (num: string) => {
    if (lockoutTime > 0) return;

    const currentPin = step === 'enter' ? pin : confirmPin;
    if (currentPin.length < 4) {
      if (step === 'enter') {
        const newPin = pin + num;
        setPin(newPin);

        if (newPin.length === 4) {
          handlePINComplete(newPin);
        }
      } else {
        const newConfirmPin = confirmPin + num;
        setConfirmPin(newConfirmPin);

        if (newConfirmPin.length === 4) {
          handleConfirmPINComplete(newConfirmPin);
        }
      }
    }
  };

  const handlePINComplete = async (completedPin: string) => {
    if (mode === 'verify') {
      const isValid = await verifyPIN(completedPin);

      if (isValid) {
        onUnlock();
      } else {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        if (newAttemptCount >= 5) {
          setLockoutTime(30);
          setError('Too many attempts. Wait 30 seconds.');
        } else {
          const remaining = 5 - newAttemptCount;
          setError('Wrong PIN. ' + remaining + ' attempts remaining.');
        }

        shakeAnimation();
        setTimeout(() => {
          setPin('');
          setError('');
        }, 1500);
      }
    } else {
      setStep('confirm');
      setError('');
    }
  };

  const handleConfirmPINComplete = async (completedConfirmPin: string) => {
    if (pin === completedConfirmPin) {
      const success = await setPIN(pin);

      if (success) {
        if (onPINCreated) {
          onPINCreated();
        } else {
          onUnlock();
        }
      } else {
        setError('Failed to save PIN. Please try again.');
        resetPINEntry();
      }
    } else {
      setError('PINs do not match. Try again.');
      shakeAnimation();
      setTimeout(() => {
        resetPINEntry();
      }, 1500);
    }
  };

  const resetPINEntry = () => {
    setPin('');
    setConfirmPin('');
    setStep('enter');
    setError('');
  };

  const handleDelete = () => {
    if (step === 'enter') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
    setError('');
  };

  const renderDots = () => {
    const currentPin = step === 'enter' ? pin : confirmPin;
    return (
      <Animated.View
        style={[styles.dotsContainer, { transform: [{ translateX: shakeAnim }] }]}
      >
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  currentPin.length > index ? theme.primary : 'transparent',
                borderColor: theme.border,
              },
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  const renderKeypad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'delete'],
    ];

    return (
      <View style={styles.keypad}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={styles.keyButton} />;
              }

              if (key === 'delete') {
                return (
                  <TouchableOpacity
                    key={keyIndex}
                    style={styles.keyButton}
                    onPress={handleDelete}
                    disabled={lockoutTime > 0}
                  >
                    <Ionicons name="backspace-outline" size={28} color={theme.text} />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={keyIndex}
                  style={[styles.keyButton, { backgroundColor: theme.surface }]}
                  onPress={() => handleNumberPress(key)}
                  disabled={lockoutTime > 0}
                >
                  <Text style={[styles.keyText, { color: theme.text }]}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const getTitle = () => {
    if (lockoutTime > 0) {
      return 'Locked';
    }
    if (mode === 'verify') {
      return 'Enter PIN';
    }
    if (step === 'enter') {
      return mode === 'create' ? 'Create Your PIN' : 'Enter New PIN';
    }
    return 'Confirm Your PIN';
  };

  const getSubtitle = () => {
    if (lockoutTime > 0) {
      return 'Please wait ' + lockoutTime + ' seconds';
    }
    if (mode === 'verify') {
      return 'Enter your 4-digit PIN to unlock';
    }
    if (step === 'enter') {
      return 'Choose a 4-digit PIN to secure your diary';
    }
    return 'Re-enter your PIN to confirm';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.text }]}>BioDiary</Text>
          <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="lock-closed" size={40} color={theme.primary} />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{getTitle()}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {getSubtitle()}
          </Text>
        </View>

        {renderDots()}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
          </View>
        ) : (
          <View style={styles.errorContainer} />
        )}
      </View>

      {renderKeypad()}

      {mode !== 'verify' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            if (step === 'confirm') {
              resetPINEntry();
            }
          }}
        >
          <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
            {step === 'confirm' ? 'Back' : ''}
          </Text>
        </TouchableOpacity>
      )}
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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: spacing.sm,
  },
  errorContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  keypad: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  keyButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '400',
  },
  cancelButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
  },
});
