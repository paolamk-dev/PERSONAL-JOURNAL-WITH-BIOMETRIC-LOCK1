import { Timestamp } from 'firebase/firestore';

export type MoodType = 'happy' | 'sad' | 'neutral' | 'anxious' | 'excited';

export interface DailyPhoto {
  id: string;
  entryId: string;
  supabaseUrl: string;
  supabasePath: string;
  caption: string;
  uploadedAt: Timestamp;
  localUri?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  body: string;
  mood: MoodType | null;
  tags: string[];
  photos: DailyPhoto[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isFavorite: boolean;
  wordCount: number;
}

export interface EntryDraft {
  title: string;
  body: string;
  mood: MoodType | null;
  tags: string[];
  photos: DailyPhoto[];
}
