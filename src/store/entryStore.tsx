import React, { createContext, useContext, useState, ReactNode } from 'react';
import { JournalEntry } from '../types/entry.types';

interface EntryContextType {
  entries: JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
  selectedEntry: JournalEntry | null;
  setSelectedEntry: (entry: JournalEntry | null) => void;
  addEntry: (entry: JournalEntry) => void;
  updateEntryInStore: (entryId: string, updates: Partial<JournalEntry>) => void;
  removeEntry: (entryId: string) => void;
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

interface EntryProviderProps {
  children: ReactNode;
}

export const EntryProvider: React.FC<EntryProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const addEntry = (entry: JournalEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const updateEntryInStore = (entryId: string, updates: Partial<JournalEntry>) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      )
    );
  };

  const removeEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  return (
    <EntryContext.Provider
      value={{
        entries,
        setEntries,
        selectedEntry,
        setSelectedEntry,
        addEntry,
        updateEntryInStore,
        removeEntry,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntryStore = (): EntryContextType => {
  const context = useContext(EntryContext);
  if (!context) {
    throw new Error('useEntryStore must be used within an EntryProvider');
  }
  return context;
};
