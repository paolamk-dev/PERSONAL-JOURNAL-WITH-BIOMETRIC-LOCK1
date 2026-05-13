import { format, isToday, isYesterday, startOfDay } from 'date-fns';
import { JournalEntry } from '../types/entry.types';

export interface GroupedEntries {
  title: string;
  data: JournalEntry[];
}

export const groupEntriesByDate = (entries: JournalEntry[]): GroupedEntries[] => {
  const grouped: Record<string, JournalEntry[]> = {};

  entries.forEach((entry) => {
    const date = entry.createdAt.toDate();
    const dateKey = format(date, 'yyyy-MM-dd');

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(entry);
  });

  const sections: GroupedEntries[] = Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a)) // Sort descending
    .map((dateKey) => ({
      title: formatSectionHeader(new Date(dateKey)),
      data: grouped[dateKey],
    }));

  return sections;
};

export const formatSectionHeader = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'EEE, MMM d yyyy');
};

export const formatEntryDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy • h:mm a');
};

export const formatCalendarDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};
