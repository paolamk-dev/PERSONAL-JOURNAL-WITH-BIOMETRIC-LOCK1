import Constants from 'expo-constants';

const expoConfig = Constants.expoConfig;
const extra = expoConfig?.extra || {};

// Firebase configuration
export const FIREBASE_API_KEY = extra.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '';
export const FIREBASE_AUTH_DOMAIN = extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '';
export const FIREBASE_PROJECT_ID = extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '';
export const FIREBASE_STORAGE_BUCKET = extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
export const FIREBASE_MESSAGING_SENDER_ID = extra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '';
export const FIREBASE_APP_ID = extra.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '';

// Supabase configuration
export const SUPABASE_URL = extra.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = extra.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
export const SUPABASE_BUCKET_NAME = extra.EXPO_PUBLIC_SUPABASE_BUCKET_NAME || process.env.EXPO_PUBLIC_SUPABASE_BUCKET_NAME || 'biodiary-media';

// Dev flags
export const IS_DEV_MOCK_BIOMETRIC = extra.IS_DEV_MOCK_BIOMETRIC === 'true' || process.env.IS_DEV_MOCK_BIOMETRIC === 'true';
