const StatsService = require('../../src/services/statsService');

// Mock the SmartDataManager
jest.mock('../../src/utils/dataManager');

describe('StatsService Unit Tests', () => {
  let statsService;
  let mockDataManager;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create fresh instance
    statsService = new StatsService();
    mockDataManager = statsService.dataManager;
  });

  describe('calculateStats', () => {
    test('should calculate stats for valid items', () => {
      const mockItems = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99 },
        { id: 2, name: 'Chair', category: 'Furniture', price: 199.99 },
        { id: 3, name: 'Phone', category: 'Electronics', price: 599.99 },
        { id: 4, name: 'Table', category: 'Furniture', price: 299.99 }
      ];

      const stats = statsService.calculateStats(mockItems);

      expect(stats.total).toBe(4);
      expect(stats.averagePrice).toBe(524.99);
      expect(stats.categories).toEqual({
        'Electronics': 2,
        'Furniture': 2
      });
      expect(stats.priceRange).toEqual({
        min: 199.99,
        max: 999.99
      });
      expect(stats.lastCalculated).toBeDefined();
    });

    test('should handle empty items array', () => {
      const stats = statsService.calculateStats([]);

      expect(stats.total).toBe(0);
      expect(stats.averagePrice).toBe(0);
      expect(stats.categories).toEqual({});
      expect(stats.priceRange).toEqual({ min: 0, max: 0 });
    });

    test('should handle null/undefined items', () => {
      const stats = statsService.calculateStats(null);

      expect(stats.total).toBe(0);
      expect(stats.averagePrice).toBe(0);
      expect(stats.categories).toEqual({});
      expect(stats.priceRange).toEqual({ min: 0, max: 0 });
    });

    test('should handle items with missing prices', () => {
      const mockItems = [
        { id: 1, name: 'Item1', category: 'Test', price: 100 },
        { id: 2, name: 'Item2', category: 'Test', price: null },
        { id: 3, name: 'Item3', category: 'Test', price: undefined },
        { id: 4, name: 'Item4', category: 'Test', price: 200 }
      ];

      const stats = statsService.calculateStats(mockItems);

      expect(stats.total).toBe(4);
      expect(stats.averagePrice).toBe(75); // (100 + 0 + 0 + 200) / 4
      expect(stats.priceRange).toEqual({ min: 100, max: 200 });
    });

    test('should handle items with missing categories', () => {
      const mockItems = [
        { id: 1, name: 'Item1', category: 'Electronics', price: 100 },
        { id: 2, name: 'Item2', category: null, price: 200 },
        { id: 3, name: 'Item3', price: 300 } // no category property
      ];

      const stats = statsService.calculateStats(mockItems);

      expect(stats.categories).toEqual({
        'Electronics': 1,
        'Uncategorized': 2
      });
    });
  });

  describe('getStats', () => {
    test('should return cached stats if cache is valid', async () => {
      const mockItems = [
        { id: 1, name: 'Test', category: 'Test', price: 100 }
      ];

      // Mock data manager
      mockDataManager.getData.mockResolvedValue(mockItems);

      // First call - should calculate and cache
      const stats1 = await statsService.getStats();
      
      // Second call - should return cached data
      const stats2 = await statsService.getStats();

      expect(stats1).toEqual(stats2);
      expect(mockDataManager.getData).toHaveBeenCalledTimes(1); // Only called once
      expect(stats1.total).toBe(1);
    });

    test('should recalculate stats when cache expires', async () => {
      const mockItems = [
        { id: 1, name: 'Test', category: 'Test', price: 100 }
      ];

      mockDataManager.getData.mockResolvedValue(mockItems);

      // First call
      await statsService.getStats();

      // Simulate cache expiry by setting lastCalculated to old timestamp
      statsService.statsLastCalculated = Date.now() - (statsService.STATS_CACHE_DURATION + 1000);

      // Second call - should recalculate
      await statsService.getStats();

      expect(mockDataManager.getData).toHaveBeenCalledTimes(2); // Called twice
    });

    test('should handle data manager errors', async () => {
      mockDataManager.getData.mockRejectedValue(new Error('Database error'));

      await expect(statsService.getStats()).rejects.toThrow('Database error');
    });
  });

  describe('refreshStats', () => {
    test('should force refresh and return new stats', async () => {
      const mockItems = [
        { id: 1, name: 'Test', category: 'Test', price: 100 }
      ];

      mockDataManager.getData.mockResolvedValue(mockItems);

      // Populate cache first
      await statsService.getStats();

      // Force refresh
      const result = await statsService.refreshStats();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Stats cache refreshed manually');
      expect(result.stats.total).toBe(1);
      expect(mockDataManager.getData).toHaveBeenCalledTimes(2); // Called twice
    });
  });

  describe('getCacheInfo', () => {
    test('should return cache info when no cache exists', () => {
      const cacheInfo = statsService.getCacheInfo();

      expect(cacheInfo.hasCache).toBe(false);
      expect(cacheInfo.cacheAge).toBe(null);
      expect(cacheInfo.isExpired).toBe(false);
      expect(cacheInfo.cacheDuration).toBe(300); // 5 minutes in seconds
      expect(cacheInfo.lastCalculated).toBe(null);
    });

    test('should return cache info when cache exists', async () => {
      const mockItems = [{ id: 1, name: 'Test', category: 'Test', price: 100 }];
      mockDataManager.getData.mockResolvedValue(mockItems);

      // Populate cache
      await statsService.getStats();

      const cacheInfo = statsService.getCacheInfo();

      expect(cacheInfo.hasCache).toBe(true);
      expect(cacheInfo.isExpired).toBe(false);
      expect(cacheInfo.lastCalculated).toBeDefined();
    });

    test('should detect expired cache', async () => {
      const mockItems = [{ id: 1, name: 'Test', category: 'Test', price: 100 }];
      mockDataManager.getData.mockResolvedValue(mockItems);

      // Populate cache
      await statsService.getStats();

      // Simulate cache expiry
      statsService.statsLastCalculated = Date.now() - (statsService.STATS_CACHE_DURATION + 1000);

      const cacheInfo = statsService.getCacheInfo();

      expect(cacheInfo.hasCache).toBe(true);
      expect(cacheInfo.isExpired).toBe(true);
    });
  });

  describe('clearCache', () => {
    test('should clear cache and reset timestamp', async () => {
      const mockItems = [{ id: 1, name: 'Test', category: 'Test', price: 100 }];
      mockDataManager.getData.mockResolvedValue(mockItems);

      // Populate cache
      await statsService.getStats();

      // Verify cache exists
      expect(statsService.statsCache).toBeDefined();
      expect(statsService.statsLastCalculated).toBeGreaterThan(0);

      // Clear cache
      statsService.clearCache();

      // Verify cache is cleared
      expect(statsService.statsCache).toBe(null);
      expect(statsService.statsLastCalculated).toBe(0);
    });
  });
}); 