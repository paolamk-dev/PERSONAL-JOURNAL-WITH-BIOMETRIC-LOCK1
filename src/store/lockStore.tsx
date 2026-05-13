import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LockContextType {
  isLocked: boolean;
  lockMode: 'biometric' | 'pin' | null;
  setIsLocked: (locked: boolean) => void;
  setLockMode: (mode: 'biometric' | 'pin' | null) => void;
  unlock: () => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

interface LockProviderProps {
  children: ReactNode;
}

export const LockProvider: React.FC<LockProviderProps> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [lockMode, setLockMode] = useState<'biometric' | 'pin' | null>(null);

  const unlock = () => {
    setIsLocked(false);
    setLockMode(null);
  };

  return (
    <LockContext.Provider
      value={{
        isLocked,
        lockMode,
        setIsLocked,
        setLockMode,
        unlock,
      }}
    >
      {children}
    </LockContext.Provider>
  );
};

export const useLock = (): LockContextType => {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error('useLock must be used within a LockProvider');
  }
  return context;
};
