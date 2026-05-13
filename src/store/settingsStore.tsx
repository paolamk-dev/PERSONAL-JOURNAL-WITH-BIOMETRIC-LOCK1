import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../constants/colors';
import { UserSettings } from '../types/auth.types';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  settings: UserSettings | null;
  updateSettings: (settings: UserSettings) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Determine theme based on settings or system preference
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (!settings) {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }

    if (settings.theme === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }

    return settings.theme;
  };

  const effectiveTheme = getEffectiveTheme();
  const isDark = effectiveTheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, settings, updateSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
