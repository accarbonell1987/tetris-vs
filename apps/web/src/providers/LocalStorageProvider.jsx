import React, { useEffect } from 'react';
import { useGlobalStorage } from '../store';
import { StorageService } from '../services/localStorageService';

const LocalStorageProvider = ({ children }) => {
  const { setPlayer } = useGlobalStorage();

  // Restore the session once on mount. Reading storage during render returned a new object
  // every time, which re-ran this effect and looped through setPlayer forever.
  useEffect(() => {
    const storageValue = StorageService.getItem('tetris');
    if (!storageValue) return;

    const { user } = storageValue;
    const isExpiredTime = StorageService.isExpired();
    if (isExpiredTime) StorageService.removeItem('tetris');
    else setPlayer(user);
  }, [setPlayer]);

  return children;
};

export default LocalStorageProvider;
