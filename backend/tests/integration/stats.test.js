const request = require('supertest');
const app = require('../../src/index');

describe('Stats API Integration Tests', () => {
  describe('GET /api/stats', () => {
    test('should return basic stats', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('averagePrice');
      expect(response.body).toHaveProperty('categories');
      expect(response.body).toHaveProperty('priceRange');
      expect(response.body).toHaveProperty('lastCalculated');
      
      expect(response.body.total).toBeGreaterThan(0);
      expect(response.body.averagePrice).toBeGreaterThan(0);
      expect(typeof response.body.categories).toBe('object');
      expect(response.body.priceRange).toHaveProperty('min');
      expect(response.body.priceRange).toHaveProperty('max');
    });

    test('should cache stats and return same data on subsequent requests', async () => {
      // First request
      const response1 = await request(app)
        .get('/api/stats')
        .expect(200);

      // Second request (should use cache)
      const response2 = await request(app)
        .get('/api/stats')
        .expect(200);

      // Should be identical (cached) - data should be the same
      expect(response1.body.total).toBe(response2.body.total);
      expect(response1.body.averagePrice).toBe(response2.body.averagePrice);
      expect(response1.body.categories).toEqual(response2.body.categories);
      expect(response1.body.priceRange).toEqual(response2.body.priceRange);
      
      // Timestamps should be very close (within 1 second) for cached responses
      const time1 = new Date(response1.body.lastCalculated).getTime();
      const time2 = new Date(response2.body.lastCalculated).getTime();
      expect(Math.abs(time1 - time2)).toBeLessThan(1000);
    });

    test('should calculate category distribution correctly', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body.categories).toHaveProperty('Electronics');
      expect(response.body.categories).toHaveProperty('Furniture');
      expect(response.body.categories).toHaveProperty('Appliances');
      expect(response.body.categories).toHaveProperty('Office Supplies');

      // Check that category counts are reasonable
      expect(response.body.categories.Electronics).toBeGreaterThan(0);
      expect(response.body.categories.Furniture).toBeGreaterThan(0);
    });

    test('should calculate price range correctly', async () => {
      const response = await request(app)
        .get('/api/stats')
        .expect(200);

      expect(response.body.priceRange.min).toBeGreaterThan(0);
      expect(response.body.priceRange.max).toBeGreaterThan(response.body.priceRange.min);
      expect(response.body.averagePrice).toBeGreaterThanOrEqual(response.body.priceRange.min);
      expect(response.body.averagePrice).toBeLessThanOrEqual(response.body.priceRange.max);
    });
  });

  describe('POST /api/stats/refresh', () => {
    test('should force refresh stats cache', async () => {
      // Get initial stats
      const initialResponse = await request(app)
        .get('/api/stats')
        .expect(200);

      const initialTimestamp = initialResponse.body.lastCalculated;

      // Force refresh
      const refreshResponse = await request(app)
        .post('/api/stats/refresh')
        .expect(200);

      expect(refreshResponse.body.success).toBe(true);
      expect(refreshResponse.body.message).toBe('Stats cache refreshed manually');
      expect(refreshResponse.body.stats).toHaveProperty('total');
      expect(refreshResponse.body.stats).toHaveProperty('averagePrice');

      // Get stats again (should be refreshed)
      const finalResponse = await request(app)
        .get('/api/stats')
        .expect(200);

      // Should have same data but potentially different timestamp
      expect(finalResponse.body.total).toBe(initialResponse.body.total);
      expect(finalResponse.body.averagePrice).toBe(initialResponse.body.averagePrice);
    });
  });

  describe('GET /api/stats/cache-info', () => {
    test('should return cache information', async () => {
      const response = await request(app)
        .get('/api/stats/cache-info')
        .expect(200);

      expect(response.body).toHaveProperty('hasCache');
      expect(response.body).toHaveProperty('cacheAge');
      expect(response.body).toHaveProperty('isExpired');
      expect(response.body).toHaveProperty('cacheDuration');
      expect(response.body).toHaveProperty('lastCalculated');

      expect(typeof response.body.hasCache).toBe('boolean');
      expect(typeof response.body.cacheDuration).toBe('number');
      expect(response.body.cacheDuration).toBe(300); // 5 minutes in seconds
    });

    test('should show cache status after making a request', async () => {
      // Make a stats request to populate cache
      await request(app)
        .get('/api/stats')
        .expect(200);

      // Check cache info
      const cacheInfo = await request(app)
        .get('/api/stats/cache-info')
        .expect(200);

      expect(cacheInfo.body.hasCache).toBe(true);
      expect(cacheInfo.body.isExpired).toBe(false);
      expect(cacheInfo.body.cacheAge).toBeLessThan(10); // Should be very recent
    });
  });
}); 