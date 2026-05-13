import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  BiometricLock: undefined;
  PINLock: undefined;
  Main: NavigatorScreenParams<TabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  Gallery: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeList: undefined;
  EntryEditor: { entryId?: string };
  EntryDetail: { entryId: string };
};
