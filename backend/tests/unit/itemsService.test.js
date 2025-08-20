const ItemsService = require('../../src/services/itemsService');

// Mock the SmartDataManager
jest.mock('../../src/utils/dataManager');

describe('ItemsService Unit Tests', () => {
  let itemsService;
  let mockDataManager;

  beforeEach(() => {
    jest.clearAllMocks();
    itemsService = new ItemsService();
    mockDataManager = itemsService.dataManager;
  });

  describe('getItems', () => {
    test('should return paginated and filtered items', async () => {
      const mockItems = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
        { id: 2, name: 'Chair', category: 'Furniture', price: 199 },
        { id: 3, name: 'Phone', category: 'Electronics', price: 599 }
      ];

      mockDataManager.getData.mockResolvedValue(mockItems);

      const result = await itemsService.getItems('electronics', 1, 2);

      expect(result.items).toHaveLength(2);
      expect(result.pagination.totalItems).toBe(2);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.itemsPerPage).toBe(2);
    });

    test('should handle empty search query', async () => {
      const mockItems = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999 }
      ];

      mockDataManager.getData.mockResolvedValue(mockItems);

      const result = await itemsService.getItems('', 1, 10);

      expect(result.items).toHaveLength(1);
      expect(result.pagination.totalItems).toBe(1);
    });
  });

  describe('getItemById', () => {
    test('should return item when found', async () => {
      const mockItems = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999 }
      ];

      mockDataManager.getData.mockResolvedValue(mockItems);

      const item = await itemsService.getItemById(1);

      expect(item).toEqual(mockItems[0]);
    });

    test('should throw error when item not found', async () => {
      const mockItems = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999 }
      ];

      mockDataManager.getData.mockResolvedValue(mockItems);

      await expect(itemsService.getItemById(999)).rejects.toThrow('Item not found');
    });
  });

  describe('createItem', () => {
    test('should create new item with generated ID', async () => {
      const mockItems = [];
      const newItemData = { name: 'Test Item', category: 'Test', price: 100 };

      mockDataManager.getData.mockResolvedValue(mockItems);
      
      // Mock fs.writeFile
      const fs = require('fs').promises;
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      const newItem = await itemsService.createItem(newItemData);

      expect(newItem.name).toBe('Test Item');
      expect(newItem.id).toBeDefined();
      expect(typeof newItem.id).toBe('number');
      expect(mockDataManager.clearCache).toHaveBeenCalled();
    });

    test('should add item to existing items', async () => {
      const mockItems = [
        { id: 1, name: 'Existing Item', category: 'Test', price: 50 }
      ];
      const newItemData = { name: 'New Item', category: 'Test', price: 100 };

      mockDataManager.getData.mockResolvedValue(mockItems);
      
      const fs = require('fs').promises;
      jest.spyOn(fs, 'writeFile').mockResolvedValue();

      const newItem = await itemsService.createItem(newItemData);

      expect(newItem.name).toBe('New Item');
      expect(mockItems).toHaveLength(2);
    });
  });

  describe('generateItemId', () => {
    test('should generate timestamp-based ID', () => {
      const id = itemsService.generateItemId();

      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
      expect(id).toBeLessThanOrEqual(Date.now());
    });

    test('should generate different IDs on subsequent calls', async () => {
      const id1 = itemsService.generateItemId();
      
      // Add small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 2));
      
      const id2 = itemsService.generateItemId();

      expect(id1).not.toBe(id2);
      expect(id2).toBeGreaterThan(id1);
    });
  });

  describe('getStrategyInfo', () => {
    test('should return data manager strategy info', () => {
      const mockStrategyInfo = {
        currentStrategy: 'small-file-cache',
        fileSize: 1024,
        hasCache: true
      };

      mockDataManager.getStrategyInfo.mockReturnValue(mockStrategyInfo);

      const result = itemsService.getStrategyInfo();

      expect(result).toEqual(mockStrategyInfo);
      expect(mockDataManager.getStrategyInfo).toHaveBeenCalled();
    });
  });
}); 