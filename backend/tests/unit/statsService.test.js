const statsService = require('../../src/services/StatsService');

// Mock the Stats utility
jest.mock('../../src/utils/Stats');

describe('StatsService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the cache before each test
    statsService.cache = null;
    statsService.lastCalculated = null;
  });

  describe('getStats', () => {
    test('should return stats from stats utility', async () => {
      const mockStats = {
        total: 10,
        averagePrice: 500,
        categories: { 'Electronics': 5, 'Furniture': 5 },
        priceRange: { min: 100, max: 1000 },
        lastCalculated: new Date().toISOString()
      };

      const mockStatsUtil = require('../../src/utils/Stats');
      mockStatsUtil.getStats.mockResolvedValue(mockStats);

      const result = await statsService.getStats();

      expect(mockStatsUtil.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockStats);
    });

    test('should handle stats utility errors', async () => {
      const mockStatsUtil = require('../../src/utils/Stats');
      mockStatsUtil.getStats.mockRejectedValue(new Error('Stats calculation failed'));

      await expect(statsService.getStats()).rejects.toThrow('Stats calculation failed');
    });
  });

  describe('refreshStats', () => {
    test('should refresh stats and update cache', async () => {
      const mockStats = {
        total: 10,
        averagePrice: 500,
        categories: { 'Electronics': 5, 'Furniture': 5 },
        priceRange: { min: 100, max: 1000 },
        lastCalculated: new Date().toISOString()
      };

      const mockStatsUtil = require('../../src/utils/Stats');
      mockStatsUtil.getStats.mockResolvedValue(mockStats);

      const result = await statsService.refreshStats();

      expect(mockStatsUtil.getStats).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockStats);
      expect(statsService.cache).toEqual(mockStats);
      expect(statsService.lastCalculated).toBeInstanceOf(Date);
    });
  });

  describe('getCacheInfo', () => {
    test('should return cache information when no cache exists', () => {
      const cacheInfo = statsService.getCacheInfo();

      expect(cacheInfo.hasCache).toBe(false);
      expect(cacheInfo.cacheAge).toBe(null);
      expect(cacheInfo.isExpired).toBe(false);
      expect(cacheInfo.cacheDuration).toBe(300);
      expect(cacheInfo.lastCalculated).toBe(null);
    });

    test('should return cache information when cache exists', () => {
      // Set up a cache
      statsService.cache = { total: 10 };
      statsService.lastCalculated = new Date();

      const cacheInfo = statsService.getCacheInfo();

      expect(cacheInfo.hasCache).toBe(true);
      expect(cacheInfo.cacheAge).toBeLessThan(1); // Should be very recent
      expect(cacheInfo.isExpired).toBe(false);
      expect(cacheInfo.cacheDuration).toBe(300);
      expect(cacheInfo.lastCalculated).toBe(statsService.lastCalculated.toISOString());
    });
  });
}); 