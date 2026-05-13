export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

export const validatePIN = (pin: string): boolean => {
  return /^\d{4}$/.test(pin);
};

export const validateEntryTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 120;
};

export const validateEntryBody = (body: string): boolean => {
  return body.trim().length > 0;
};

export const stripHTMLTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

export const calculateWordCount = (text: string): number => {
  const stripped = stripHTMLTags(text);
  const words = stripped.trim().split(/\s+/);
  return words.filter((word) => word.length > 0).length;
};

export const getPreviewText = (html: string, maxLength: number = 80): string => {
  const stripped = stripHTMLTags(html);
  return stripped.length > maxLength
    ? stripped.substring(0, maxLength) + '...'
    : stripped;
};
