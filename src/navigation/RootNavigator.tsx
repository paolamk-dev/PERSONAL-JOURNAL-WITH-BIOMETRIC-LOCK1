import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../store/settingsStore';
import { useLock } from '../store/lockStore';
import { usePIN } from '../hooks/usePIN';
import { useBiometric } from '../hooks/useBiometric';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { BiometricLockScreen } from '../screens/lock/BiometricLockScreen';
import { PINLockScreen } from '../screens/lock/PINLockScreen';
import { RootStackParamList } from '../types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme, settings } = useTheme();
  const { isLocked, lockMode, setIsLocked, setLockMode, unlock } = useLock();
  const { isPINSet, loading: pinLoading } = usePIN();
  const { isAvailable: biometricAvailable, isEnrolled: biometricEnrolled } = useBiometric();

  const [showPINSetup, setShowPINSetup] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Initial lock check when user logs in
  useEffect(() => {
    if (user && !authLoading && !pinLoading && !initialCheckDone) {
      checkLockStatus();
      setInitialCheckDone(true);
    }
  }, [user, authLoading, pinLoading, initialCheckDone]);

  // Reset initial check when user logs out
  useEffect(() => {
    if (!user) {
      setInitialCheckDone(false);
      setShowPINSetup(false);
      unlock();
    }
  }, [user]);

  const checkLockStatus = () => {
    // If PIN is not set, show PIN setup for first-time users
    if (!isPINSet) {
      setShowPINSetup(true);
      return;
    }

    // Check if biometric is enabled and available
    const biometricEnabled = settings?.biometricEnabled ?? false;
    const pinEnabled = settings?.pinEnabled ?? true; // Default to PIN enabled

    if (biometricEnabled && biometricAvailable && biometricEnrolled) {
      setIsLocked(true);
      setLockMode('biometric');
    } else if (pinEnabled || isPINSet) {
      setIsLocked(true);
      setLockMode('pin');
    }
  };

  const handlePINSetupComplete = () => {
    setShowPINSetup(false);
    // After PIN setup, don't lock immediately
  };

  const handleSwitchToPIN = () => {
    setLockMode('pin');
  };

  if (authLoading || pinLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Show PIN setup for first-time users
  if (user && showPINSetup) {
    return (
      <View style={{ flex: 1 }}>
        <PINLockScreen
          mode="create"
          onUnlock={() => {}}
          onPINCreated={handlePINSetupComplete}
        />
      </View>
    );
  }

  // Show lock screens if locked
  if (user && isLocked) {
    if (lockMode === 'biometric') {
      return (
        <View style={{ flex: 1 }}>
          <BiometricLockScreen
            onUnlock={unlock}
            onUsePIN={handleSwitchToPIN}
          />
        </View>
      );
    }

    if (lockMode === 'pin') {
      return (
        <View style={{ flex: 1 }}>
          <PINLockScreen
            mode="verify"
            onUnlock={unlock}
          />
        </View>
      );
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
