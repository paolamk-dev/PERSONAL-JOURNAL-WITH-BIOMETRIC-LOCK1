import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { JournalEntry } from '../types/entry.types';

export const createEntry = async (
  userId: string,
  entryData: Partial<JournalEntry>
): Promise<string> => {
  try {
    const entryId = entryData.id || '';
    const entryRef = doc(db, 'users', userId, 'entries', entryId);

    const now = Timestamp.now();
    const entry: JournalEntry = {
      id: entryId,
      userId,
      title: entryData.title || '',
      body: entryData.body || '',
      mood: entryData.mood || null,
      tags: entryData.tags || [],
      photos: entryData.photos || [],
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      wordCount: entryData.wordCount || 0,
    };

    await setDoc(entryRef, entry);
    return entryId;
  } catch (error) {
    console.error('Error creating entry:', error);
    throw new Error('Failed to create entry');
  }
};

export const updateEntry = async (
  userId: string,
  entryId: string,
  updates: Partial<JournalEntry>
): Promise<void> => {
  try {
    const entryRef = doc(db, 'users', userId, 'entries', entryId);
    await updateDoc(entryRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating entry:', error);
    throw new Error('Failed to update entry');
  }
};

export const deleteEntry = async (userId: string, entryId: string): Promise<void> => {
  try {
    const entryRef = doc(db, 'users', userId, 'entries', entryId);
    await deleteDoc(entryRef);
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw new Error('Failed to delete entry');
  }
};

export const getEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const entriesRef = collection(db, 'users', userId, 'entries');
    const q = query(entriesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const entries: JournalEntry[] = [];
    querySnapshot.forEach((doc) => {
      entries.push(doc.data() as JournalEntry);
    });

    return entries;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw new Error('Failed to fetch entries');
  }
};

export const getEntriesByDate = async (
  userId: string,
  date: string
): Promise<JournalEntry[]> => {
  try {
    const entries = await getEntries(userId);
    return entries.filter((entry) => {
      const entryDate = entry.createdAt.toDate();
      const dateStr = entryDate.toISOString().split('T')[0];
      return dateStr === date;
    });
  } catch (error) {
    console.error('Error fetching entries by date:', error);
    throw new Error('Failed to fetch entries by date');
  }
};

export const getEntryDates = async (userId: string): Promise<string[]> => {
  try {
    const entries = await getEntries(userId);
    const dates = entries.map((entry) => {
      const date = entry.createdAt.toDate();
      return date.toISOString().split('T')[0];
    });
    return Array.from(new Set(dates));
  } catch (error) {
    console.error('Error fetching entry dates:', error);
    throw new Error('Failed to fetch entry dates');
  }
};

export const toggleFavorite = async (
  userId: string,
  entryId: string,
  currentState: boolean
): Promise<void> => {
  try {
    await updateEntry(userId, entryId, { isFavorite: !currentState });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw new Error('Failed to toggle favorite');
  }
};

export const searchEntries = async (
  userId: string,
  query: string
): Promise<JournalEntry[]> => {
  try {
    const entries = await getEntries(userId);
    const lowerQuery = query.toLowerCase();

    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.body.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching entries:', error);
    throw new Error('Failed to search entries');
  }
};
