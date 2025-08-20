const itemsService = require('../../src/services/ItemsService');

// Mock the DataManager
jest.mock('../../src/utils/DataManager');

describe('ItemsService Unit Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllItems', () => {
    test('should return all items from data manager', async () => {
      const mockItems = [
        { id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 },
        { id: 2, name: 'Test Item 2', category: 'Furniture', price: 200 }
      ];

      // Mock the dataManager.getAllItems method
      const mockDataManager = require('../../src/utils/DataManager');
      mockDataManager.getAllItems.mockResolvedValue(mockItems);

      const result = await itemsService.getAllItems();

      expect(mockDataManager.getAllItems).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockItems);
    });

    test('should handle data manager errors', async () => {
      const mockDataManager = require('../../src/utils/DataManager');
      mockDataManager.getAllItems.mockRejectedValue(new Error('Data load failed'));

      await expect(itemsService.getAllItems()).rejects.toThrow('Data load failed');
    });
  });

  describe('getItemById', () => {
    test('should return item by ID', async () => {
      const mockItems = [
        { id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 },
        { id: 2, name: 'Test Item 2', category: 'Furniture', price: 200 }
      ];

      const mockDataManager = require('../../src/utils/DataManager');
      mockDataManager.getAllItems.mockResolvedValue(mockItems);

      const result = await itemsService.getItemById(1);

      expect(result).toEqual({ id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 });
    });

    test('should return undefined for non-existent ID', async () => {
      const mockItems = [
        { id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 }
      ];

      const mockDataManager = require('../../src/utils/DataManager');
      mockDataManager.getAllItems.mockResolvedValue(mockItems);

      const result = await itemsService.getItemById(999);

      expect(result).toBeUndefined();
    });

    test('should handle string ID conversion', async () => {
      const mockItems = [
        { id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 }
      ];

      const mockDataManager = require('../../src/utils/DataManager');
      mockDataManager.getAllItems.mockResolvedValue(mockItems);

      const result = await itemsService.getItemById('1');

      expect(result).toEqual({ id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 });
    });
  });
}); 