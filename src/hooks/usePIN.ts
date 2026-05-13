import { useState, useEffect } from 'react';
import { storePINHash, getPINHash, clearPINHash } from '../services/secure.service';
import { hashPIN, verifyPIN } from '../utils/hashUtils';

export const usePIN = () => {
  const [isPINSet, setIsPINSet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPINStatus();
  }, []);

  const checkPINStatus = async () => {
    try {
      const hash = await getPINHash();
      setIsPINSet(hash !== null);
    } catch (error) {
      console.error('Error checking PIN status:', error);
      setIsPINSet(false);
    } finally {
      setLoading(false);
    }
  };

  const setPIN = async (pin: string): Promise<boolean> => {
    try {
      const hash = await hashPIN(pin);
      await storePINHash(hash);
      setIsPINSet(true);
      return true;
    } catch (error) {
      console.error('Error setting PIN:', error);
      return false;
    }
  };

  const verifyPINInput = async (pin: string): Promise<boolean> => {
    try {
      const storedHash = await getPINHash();
      if (!storedHash) {
        return false;
      }
      return await verifyPIN(pin, storedHash);
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  const removePIN = async (): Promise<boolean> => {
    try {
      await clearPINHash();
      setIsPINSet(false);
      return true;
    } catch (error) {
      console.error('Error removing PIN:', error);
      return false;
    }
  };

  return {
    isPINSet,
    loading,
    setPIN,
    verifyPIN: verifyPINInput,
    removePIN,
    checkPINStatus,
  };
};
