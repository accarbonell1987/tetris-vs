import { describe, test, expect, vi, beforeEach } from 'vitest';
import { StorageService } from '../../src/services/localStorageService.js';
import { isExpiredDate } from '../../src/views/Login/func/functions.js';

// Mock the isExpiredDate function
vi.mock('../../src/views/Login/func/functions.js', () => ({
  isExpiredDate: vi.fn(),
}));

describe('StorageService', () => {
  let localStorageMock;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    globalThis.localStorage = localStorageMock;
  });

  describe('getItem', () => {
    test('returns parsed JSON when item exists', () => {
      localStorageMock.getItem.mockReturnValue('{"user":"test"}');
      expect(StorageService.getItem('tetris')).toEqual({ user: 'test' });
      expect(localStorageMock.getItem).toHaveBeenCalledWith('tetris');
    });

    test('returns null when item does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(StorageService.getItem('tetris')).toBeNull();
    });

    test('returns null and logs error on JSON parse error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue('invalid json');
      expect(StorageService.getItem('tetris')).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error getting item from localStorage:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('setItem', () => {
    test('stores stringified value', () => {
      const result = StorageService.setItem('tetris', { user: 'test' });
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('tetris', '{"user":"test"}');
    });

    test('returns false and logs error on exception', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem.mockImplementation(() => { throw new Error('Quota exceeded'); });
      const result = StorageService.setItem('tetris', {});
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error setting item in localStorage:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    test('removes item', () => {
      const result = StorageService.removeItem('tetris');
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('tetris');
    });

    test('returns false and logs error on exception', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.removeItem.mockImplementation(() => { throw new Error('Security error'); });
      const result = StorageService.removeItem('tetris');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Error removing item from localStorage:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('isExpired', () => {
    test('calls isExpiredDate with saveTime from stored item', () => {
      const mockItem = { user: {}, saveTime: 123456789 };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockItem));
      StorageService.isExpired();
      expect(isExpiredDate).toHaveBeenCalledWith(123456789);
    });

    test('returns true when no item exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      // isExpiredDate will be called with undefined
      isExpiredDate.mockReturnValue(true);
      expect(StorageService.isExpired()).toBe(true);
      expect(isExpiredDate).toHaveBeenCalledWith(undefined);
    });

    test('returns false when session is not expired', () => {
      const mockItem = { user: {}, saveTime: Date.now() };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockItem));
      isExpiredDate.mockReturnValue(false);
      expect(StorageService.isExpired()).toBe(false);
    });
  });
});