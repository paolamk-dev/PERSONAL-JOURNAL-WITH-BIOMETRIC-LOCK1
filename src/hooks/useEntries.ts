import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '../types/entry.types';
import * as entryService from '../services/entry.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './useAuth';

const CACHE_KEY_PREFIX = 'biodiary_entries_cache_';

export const useEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async (fromCache: boolean = true) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Try to load from cache first
      if (fromCache) {
        const cached = await loadFromCache();
        if (cached) {
          setEntries(cached);
        }
      }

      // Fetch from Firestore
      const fetchedEntries = await entryService.getEntries(user.uid);
      setEntries(fetchedEntries);

      // Update cache
      await saveToCache(fetchedEntries);
    } catch (err: any) {
      console.error('Error loading entries:', err);
      setError(err.message || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadEntries(false);
    setRefreshing(false);
  };

  const loadFromCache = async (): Promise<JournalEntry[] | null> => {
    if (!user) return null;

    try {
      const cacheKey = CACHE_KEY_PREFIX + user.uid;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
    return null;
  };

  const saveToCache = async (entriesToCache: JournalEntry[]) => {
    if (!user) return;

    try {
      const cacheKey = CACHE_KEY_PREFIX + user.uid;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(entriesToCache));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  return {
    entries,
    loading,
    refreshing,
    error,
    refresh,
    reload: loadEntries,
  };
};
