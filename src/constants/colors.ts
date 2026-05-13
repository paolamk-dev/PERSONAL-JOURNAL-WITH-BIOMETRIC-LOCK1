export const lightTheme = {
  background: '#FAFAF8',
  surface: '#FFFFFF',
  primary: '#4A6FA5',
  primaryLight: '#D6E4F7',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  danger: '#EF4444',
  success: '#10B981',
  accent: '#F59E0B',
  cardShadow: 'rgba(0,0,0,0.08)',
};

export const darkTheme = {
  background: '#0F0F1A',
  surface: '#1A1A2E',
  primary: '#6B9FD4',
  primaryLight: '#1E3A5F',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  border: '#374151',
  danger: '#F87171',
  success: '#34D399',
  accent: '#FCD34D',
  cardShadow: 'rgba(0,0,0,0.4)',
};

export type Theme = typeof lightTheme;
