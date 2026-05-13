export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const fontSizeScale = {
  small: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 19,
    '2xl': 22,
    '3xl': 28,
    '4xl': 34,
  },
  medium: fontSizes,
  large: {
    xs: 13,
    sm: 15,
    base: 17,
    lg: 19,
    xl: 21,
    '2xl': 26,
    '3xl': 32,
    '4xl': 38,
  },
};

export type FontSize = 'small' | 'medium' | 'large';
