import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/store/authStore';
import { ThemeProvider } from './src/store/settingsStore';
import { EntryProvider } from './src/store/entryStore';
import { LockProvider } from './src/store/lockStore';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <LockProvider>
              <EntryProvider>
                <StatusBar style="auto" />
                <RootNavigator />
              </EntryProvider>
            </LockProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
