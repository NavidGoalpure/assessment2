const dataManager = require('../../src/utils/DataManager');
const fs = require('fs').promises;
const path = require('path');

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn()
  }
}));

describe('DataManager Unit Tests', () => {
  let mockFs;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs = require('fs').promises;
    // Reset the singleton instance for each test
    dataManager.cache = null;
    dataManager.lastLoad = 0;
  });

  describe('getAllItems', () => {
    test('should return cached data if available', async () => {
      const mockData = [
        { id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 },
        { id: 2, name: 'Test Item 2', category: 'Furniture', price: 200 }
      ];

      // Set cache
      dataManager.cache = mockData;
      dataManager.lastLoad = Date.now();

      const result = await dataManager.getAllItems();

      expect(result).toEqual(mockData);
      expect(mockFs.readFile).not.toHaveBeenCalled();
    });

    test('should load data from file if cache is expired', async () => {
      const mockData = [
        { id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 }
      ];

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockData));

      const result = await dataManager.getAllItems();

      expect(result).toEqual(mockData);
      expect(mockFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('data/items.json'),
        'utf8'
      );
    });

    test('should handle file read errors', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(dataManager.getAllItems()).rejects.toThrow('Failed to load items data');
    });

    test('should handle invalid JSON data', async () => {
      mockFs.readFile.mockResolvedValue('invalid json');

      await expect(dataManager.getAllItems()).rejects.toThrow();
    });
  });

  describe('clearCache', () => {
    test('should clear cache and timestamp', () => {
      dataManager.cache = [{ id: 1, name: 'Test' }];
      dataManager.lastLoad = Date.now();

      dataManager.clearCache();

      expect(dataManager.cache).toBeNull();
      expect(dataManager.lastLoad).toBe(0);
    });
  });
}); 