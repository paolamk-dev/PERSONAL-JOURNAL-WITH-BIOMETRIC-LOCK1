import { useState, useEffect } from 'react';
import { getEntryDates } from '../services/entry.service';
import { useAuth } from './useAuth';

export const useCalendar = () => {
  const { user } = useAuth();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
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
      const dates = await getEntryDates(user.uid);

      const marked: Record<string, any> = {};
      dates.forEach((date) => {
        marked[date] = {
          marked: true,
          dotColor: '#4A6FA5',
        };
      });

      setMarkedDates(marked);
    } catch (error) {
      console.error('Error loading marked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    markedDates,
    loading,
    refresh: loadMarkedDates,
  };
};
