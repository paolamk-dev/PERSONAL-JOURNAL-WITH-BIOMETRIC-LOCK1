import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/settingsStore';
import { useAuth } from '../../hooks/useAuth';
import { useBiometric } from '../../hooks/useBiometric';
import { usePIN } from '../../hooks/usePIN';
import { signOut } from '../../services/auth.service';
import { spacing, borderRadius } from '../../constants/layout';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, settings, updateSettings } = useTheme();
  const { user } = useAuth();
  const { isAvailable: biometricAvailable, isEnrolled: biometricEnrolled } = useBiometric();
  const { isPINSet } = usePIN();

  const [biometricEnabled, setBiometricEnabled] = useState(biometricEnrolled);

  const handleToggleTheme = (value: boolean) => {
    if (settings) {
      updateSettings({
        ...settings,
        theme: value ? 'dark' : 'light',
      });
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleChangePIN = () => {
    Alert.alert('Change PIN', 'This feature will be implemented in Phase 10');
  };

  const handleToggleBiometric = (value: boolean) => {
    if (!biometricAvailable) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device');
      return;
    }
    if (!biometricEnrolled) {
      Alert.alert('Not Enrolled', 'Please enroll biometric authentication in your device settings');
      return;
    }
    setBiometricEnabled(value);
    // TODO: Save to user settings
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will be implemented in Phase 10');
  };

  const handleDeleteAllEntries = () => {
    Alert.alert(
      'Delete All Entries',
      'This will permanently delete all your journal entries. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'This is your last chance to cancel. All entries will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete All',
                  style: 'destructive',
                  onPress: () => {
                    // TODO: Implement delete all entries
                    Alert.alert('Feature Coming Soon', 'This will be implemented in Phase 10');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure? Your account and all data will be permanently deleted.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete My Account',
                  style: 'destructive',
                  onPress: () => {
                    // TODO: Implement delete account
                    Alert.alert('Feature Coming Soon', 'This will be implemented in Phase 10');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={theme.primary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (
        onPress && <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCOUNT</Text>
          {renderSettingItem(
            'person-circle-outline',
            'Profile',
            user?.email || 'Not signed in',
            undefined
          )}
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>
          {renderSettingItem(
            'moon-outline',
            'Dark Mode',
            'Toggle dark mode theme',
            undefined,
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#ffffff"
            />
          )}
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SECURITY</Text>
          {renderSettingItem(
            'key-outline',
            'Change PIN',
            isPINSet ? 'Update your PIN code' : 'PIN not set',
            handleChangePIN
          )}
          {renderSettingItem(
            'finger-print-outline',
            'Biometric Lock',
            biometricAvailable
              ? biometricEnrolled
                ? 'Use biometrics to unlock'
                : 'Not enrolled on device'
              : 'Not available on this device',
            undefined,
            <Switch
              value={biometricEnabled}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#ffffff"
              disabled={!biometricAvailable || !biometricEnrolled}
            />
          )}
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DATA</Text>
          {renderSettingItem(
            'download-outline',
            'Export Data',
            'Download all your entries as JSON',
            handleExportData
          )}
          {renderSettingItem(
            'trash-outline',
            'Delete All Entries',
            'Permanently delete all journal entries',
            handleDeleteAllEntries
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
          {renderSettingItem('information-circle-outline', 'Version', '1.0.0', undefined)}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: theme.danger }]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="warning-outline" size={20} color="#ffffff" />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: theme.border }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.text} />
            <Text style={[styles.signOutButtonText, { color: theme.text }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            BioDiary © 2024
          </Text>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Your personal journal, secured with biometrics
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dangerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.xs,
  },
  footerText: {
    fontSize: 12,
  },
});
