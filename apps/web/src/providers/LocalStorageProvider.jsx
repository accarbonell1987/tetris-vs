import React, { useEffect } from 'react';
import { useGlobalStorage } from '../store';
import { StorageService } from '../services/localStorageService';

const LocalStorageProvider = ({ children }) => {
  const { setPlayer } = useGlobalStorage();
  const storageValue = StorageService.getItem('tetris');

  useEffect(() => {
    if (!storageValue) return;

    const { user } = storageValue;
    const isExpiredTime = StorageService.isExpired();
    if (isExpiredTime) StorageService.removeItem('tetris');
    else setPlayer(user);
  }, []);

  return children;
};

export default LocalStorageProvider;
