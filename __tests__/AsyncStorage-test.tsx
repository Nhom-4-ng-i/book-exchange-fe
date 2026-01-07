import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, removeData, storeData } from '../utils/asyncStorage';

// The AsyncStorage module is already mocked in jest.setup.js
// These tests verify the utility functions work correctly

describe('asyncStorage utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('storeData', () => {
    it('stores data successfully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
      
      await storeData('test-key', 'test-value');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'test-value');
    });

    it('handles error when storing data', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      
      await storeData('test-key', 'test-value');
      
      expect(consoleSpy).toHaveBeenCalledWith('Error storing val ', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('stores empty string value', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
      
      await storeData('empty-key', '');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('empty-key', '');
    });

    it('stores JSON string value', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);
      const jsonValue = JSON.stringify({ name: 'test', id: 123 });
      
      await storeData('json-key', jsonValue);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('json-key', jsonValue);
    });
  });

  describe('getData', () => {
    it('retrieves data successfully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('stored-value');
      
      const result = await getData('test-key');
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe('stored-value');
    });

    it('returns null for non-existent key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      
      const result = await getData('non-existent');
      
      expect(result).toBeNull();
    });

    it('handles error when getting data', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Get error'));
      
      const result = await getData('error-key');
      
      expect(consoleSpy).toHaveBeenCalledWith('Error getting val ', expect.any(Error));
      expect(result).toBeUndefined();
      consoleSpy.mockRestore();
    });

    it('retrieves empty string', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('');
      
      const result = await getData('empty-key');
      
      expect(result).toBe('');
    });
  });

  describe('removeData', () => {
    it('removes data successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);
      
      await removeData('test-key');
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(consoleSpy).toHaveBeenCalledWith('Done.');
      consoleSpy.mockRestore();
    });

    it('handles error when removing data', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Remove error'));
      
      await removeData('error-key');
      
      expect(consoleSpy).toHaveBeenCalledWith('Error removing val ', expect.any(Error));
      expect(consoleSpy).toHaveBeenCalledWith('Done.');
      consoleSpy.mockRestore();
    });

    it('removes non-existent key without error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValueOnce(undefined);
      
      await removeData('non-existent-key');
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('non-existent-key');
      expect(consoleSpy).toHaveBeenCalledWith('Done.');
      consoleSpy.mockRestore();
    });
  });
});
