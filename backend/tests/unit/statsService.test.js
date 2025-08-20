const statsService = require('../../src/services/StatsService');

// Mock the Stats utility
jest.mock('../../src/utils/Stats');

describe('StatsService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
}); 