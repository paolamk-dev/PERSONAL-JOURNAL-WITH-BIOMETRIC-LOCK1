import { useState, useEffect } from 'react';
import { getEntryDates, getEntries } from '../services/entry.service';
import { useAuth } from './useAuth';
import { JournalEntry } from '../types/entry.types';
import { format } from 'date-fns';

export const useCalendar = () => {
  const { user } = useAuth();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [entriesByDate, setEntriesByDate] = useState<Record<string, JournalEntry[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMarkedDates();
    }
  }, [user]);

  const loadMarkedDates = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load all entries and group by date
      const entries = await getEntries(user.uid);
      const grouped: Record<string, JournalEntry[]> = {};
      const marked: Record<string, any> = {};

      entries.forEach((entry) => {
        const dateStr = format(entry.createdAt.toDate(), 'yyyy-MM-dd');

        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        grouped[dateStr].push(entry);

        marked[dateStr] = {
          marked: true,
          dotColor: '#4A6FA5',
        };
      });

      setEntriesByDate(grouped);
      setMarkedDates(marked);
    } catch (error) {
      console.error('Error loading marked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntriesForDate = (date: string): JournalEntry[] => {
    return entriesByDate[date] || [];
  };

  return {
    markedDates,
    entriesByDate,
    selectedDate,
    setSelectedDate,
    getEntriesForDate,
    loading,
    refresh: loadMarkedDates,
  };
};
