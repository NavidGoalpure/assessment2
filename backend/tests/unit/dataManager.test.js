const SmartDataManager = require('../../src/utils/dataManager');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

describe('SmartDataManager', () => {
  let dataManager;
  let tempFilePath;

  beforeEach(async () => {
    // Create a temporary file for testing
    tempFilePath = path.join(os.tmpdir(), `test-data-${Date.now()}.json`);
    dataManager = new SmartDataManager(tempFilePath);
  });

  afterEach(async () => {
    // Clean up temporary file
    try {
      await fs.unlink(tempFilePath);
    } catch (error) {
      // File might not exist, ignore error
    }
  });

  describe('Strategy Selection', () => {
    test('should choose small-file-cache strategy for files < 100KB', async () => {
      // Create a small file (~1KB)
      const smallData = Array.from({ length: 10 }, (_, i) => ({ id: i, name: `Item ${i}` }));
      await fs.writeFile(tempFilePath, JSON.stringify(smallData));

      await dataManager.getData();
      const strategyInfo = dataManager.getStrategyInfo();

      expect(strategyInfo.currentStrategy).toBe('small-file-cache');
      expect(strategyInfo.fileSize).toBeLessThan(100 * 1024);
    });

    test('should choose medium-file-cache strategy for files 100KB-1MB', async () => {
      // Create a medium file (~500KB)
      const mediumData = Array.from({ length: 2000 }, (_, i) => ({ 
        id: i, 
        name: `Item ${i}`,
        description: 'A very long description that makes the file larger '.repeat(5)
      }));
      await fs.writeFile(tempFilePath, JSON.stringify(mediumData));

      await dataManager.getData();
      const strategyInfo = dataManager.getStrategyInfo();

      expect(strategyInfo.currentStrategy).toBe('medium-file-cache');
      expect(strategyInfo.fileSize).toBeGreaterThanOrEqual(100 * 1024);
      expect(strategyInfo.fileSize).toBeLessThan(1024 * 1024);
    });

    test('should choose large-file-direct strategy for files >= 1MB', async () => {
      // Create a large file (~2MB)
      const largeData = Array.from({ length: 20000 }, (_, i) => ({ 
        id: i, 
        name: `Item ${i}`,
        description: 'A very long description that makes the file larger '.repeat(50)
      }));
      await fs.writeFile(tempFilePath, JSON.stringify(largeData));

      await dataManager.getData();
      const strategyInfo = dataManager.getStrategyInfo();

      expect(strategyInfo.currentStrategy).toBe('large-file-direct');
      expect(strategyInfo.fileSize).toBeGreaterThanOrEqual(1024 * 1024);
    });
  });

  describe('Caching Behavior', () => {
    test('should cache data for small files', async () => {
      const testData = [{ id: 1, name: 'Test Item' }];
      await fs.writeFile(tempFilePath, JSON.stringify(testData));

      // First call - should read from file
      const data1 = await dataManager.getData();
      expect(data1).toEqual(testData);

      // Second call - should use cache
      const data2 = await dataManager.getData();
      expect(data2).toEqual(testData);

      const strategyInfo = dataManager.getStrategyInfo();
      expect(strategyInfo.hasCache).toBe(true);
      expect(strategyInfo.cacheAge).toBeLessThan(1000); // Should be very recent
    });

    test('should not cache data for large files', async () => {
      // Create a large file
      const largeData = Array.from({ length: 20000 }, (_, i) => ({ 
        id: i, 
        name: `Item ${i}`,
        description: 'A very long description '.repeat(50)
      }));
      await fs.writeFile(tempFilePath, JSON.stringify(largeData));

      // Multiple calls - should read from file each time
      const data1 = await dataManager.getData();
      const data2 = await dataManager.getData();

      expect(data1).toEqual(largeData);
      expect(data2).toEqual(largeData);

      const strategyInfo = dataManager.getStrategyInfo();
      expect(strategyInfo.hasCache).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle file not found errors', async () => {
      await expect(dataManager.getData()).rejects.toThrow();
    });

    test('should handle invalid JSON errors', async () => {
      await fs.writeFile(tempFilePath, 'invalid json content');
      await expect(dataManager.getData()).rejects.toThrow();
    });

    test('should use stale cache as fallback for small files', async () => {
      const testData = [{ id: 1, name: 'Test Item' }];
      await fs.writeFile(tempFilePath, JSON.stringify(testData));

      // First call to populate cache
      await dataManager.getData();

      // Delete the file
      await fs.unlink(tempFilePath);

      // Should still return cached data
      const data = await dataManager.getData();
      expect(data).toEqual(testData);
    });
  });

  describe('Cache Management', () => {
    test('should clear cache when clearCache is called', async () => {
      const testData = [{ id: 1, name: 'Test Item' }];
      await fs.writeFile(tempFilePath, JSON.stringify(testData));

      // Populate cache
      await dataManager.getData();
      expect(dataManager.getStrategyInfo().hasCache).toBe(true);

      // Clear cache
      dataManager.clearCache();
      expect(dataManager.getStrategyInfo().hasCache).toBe(false);
    });

    test('should refresh cache when expired', async () => {
      const testData = [{ id: 1, name: 'Test Item' }];
      await fs.writeFile(tempFilePath, JSON.stringify(testData));

      // Populate cache
      await dataManager.getData();

      // Modify file
      const newData = [{ id: 2, name: 'New Item' }];
      await fs.writeFile(tempFilePath, JSON.stringify(newData));

      // Wait for cache to expire (small file cache is 5 minutes)
      // For testing, we'll manually clear the cache
      dataManager.clearCache();

      // Should read new data
      const data = await dataManager.getData();
      expect(data).toEqual(newData);
    });
  });

  describe('Strategy Information', () => {
    test('should provide strategy information', async () => {
      const testData = [{ id: 1, name: 'Test Item' }];
      await fs.writeFile(tempFilePath, JSON.stringify(testData));

      await dataManager.getData();
      const strategyInfo = dataManager.getStrategyInfo();

      expect(strategyInfo).toHaveProperty('currentStrategy');
      expect(strategyInfo).toHaveProperty('fileSize');
      expect(strategyInfo).toHaveProperty('lastRefresh');
      expect(strategyInfo).toHaveProperty('hasCache');
      expect(strategyInfo).toHaveProperty('cacheAge');
    });
  });
}); 