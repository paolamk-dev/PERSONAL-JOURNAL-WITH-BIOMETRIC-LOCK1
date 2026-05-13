import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface BiometricStatus {
  isAvailable: boolean;
  isEnrolled: boolean;
  biometricType: 'faceId' | 'fingerprint' | 'iris' | null;
}

export interface PINStatus {
  isPINSet: boolean;
  hashedPIN: string | null;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  lockTimeout: 0 | 1 | 5 | 15 | 30;
  biometricEnabled: boolean;
  pinEnabled: boolean;
  screenshotBlocked: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
