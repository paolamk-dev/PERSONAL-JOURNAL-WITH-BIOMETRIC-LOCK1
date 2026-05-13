import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTheme } from '../store/settingsStore';

export const useAppLock = () => {
  const { settings } = useTheme();
  const [shouldLock, setShouldLock] = useState(false);
  const appState = useRef(AppState.currentState);
  const backgroundTimestamp = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [settings]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // App going to background
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      backgroundTimestamp.current = Date.now();
    }

    // App coming back to foreground
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      checkLockTimeout();
    }

    appState.current = nextAppState;
  };

  const checkLockTimeout = () => {
    if (!settings || backgroundTimestamp.current === null) {
      return;
    }

    const elapsed = Date.now() - backgroundTimestamp.current;
    const lockTimeoutMs = settings.lockTimeout * 60 * 1000; // Convert minutes to ms

    // lockTimeout === 0 means lock immediately
    if (settings.lockTimeout === 0 || elapsed >= lockTimeoutMs) {
      setShouldLock(true);
    }

    backgroundTimestamp.current = null;
  };

  const unlock = () => {
    setShouldLock(false);
  };

  return {
    shouldLock,
    unlock,
  };
};
