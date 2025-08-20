const request = require('supertest');
const app = require('../../src/index');
const fs = require('fs').promises;
const path = require('path');

describe('Items API Integration Tests', () => {
  const DATA_PATH = path.join(__dirname, '../../../data/items.json');
  let originalData;

  beforeAll(async () => {
    // Backup original data
    originalData = await fs.readFile(DATA_PATH, 'utf8');
  });

  afterAll(async () => {
    // Restore original data
    await fs.writeFile(DATA_PATH, originalData);
  });

  describe('GET /api/items', () => {
    test('should return all items with default pagination', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body.items).toHaveLength(10); // default limit
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(5);
      expect(response.body.pagination.totalItems).toBe(50);
      expect(response.body.pagination.itemsPerPage).toBe(10);
    });

    test('should return items with custom pagination', async () => {
      const response = await request(app)
        .get('/api/items?pageNumber=2&itemsPerPage=5')
        .expect(200);

      expect(response.body.items).toHaveLength(5);
      expect(response.body.pagination.currentPage).toBe(2);
      expect(response.body.pagination.totalPages).toBe(10);
      expect(response.body.pagination.totalItems).toBe(50);
      expect(response.body.pagination.itemsPerPage).toBe(5);
    });

    test('should return search results', async () => {
      const response = await request(app)
        .get('/api/items?searchQuery=electronics')
        .expect(200);

      expect(response.body.items).toHaveLength(10); // Limited by default pagination
      expect(response.body.pagination.totalItems).toBe(22); // Total electronics items
      expect(response.body.items.every(item => 
        item.category === 'Electronics' || 
        item.name.toLowerCase().includes('electronics')
      )).toBe(true);
    });

    test('should return search results with pagination', async () => {
      const response = await request(app)
        .get('/api/items?searchQuery=electronics&pageNumber=1&itemsPerPage=3')
        .expect(200);

      expect(response.body.items).toHaveLength(3);
      expect(response.body.pagination.totalItems).toBe(22);
      expect(response.body.pagination.totalPages).toBe(8);
      expect(response.body.pagination.hasNextPage).toBe(true);
    });

    test('should handle case-insensitive search', async () => {
      const response = await request(app)
        .get('/api/items?searchQuery=ELECTRONICS')
        .expect(200);

      expect(response.body.items).toHaveLength(10); // Limited by default pagination
      expect(response.body.items.every(item => item.category === 'Electronics')).toBe(true);
    });

    test('should handle empty search query', async () => {
      const response = await request(app)
        .get('/api/items?searchQuery=')
        .expect(200);

      expect(response.body.items).toHaveLength(10);
      expect(response.body.pagination.totalItems).toBe(50);
    });

    test('should handle non-existent search query', async () => {
      const response = await request(app)
        .get('/api/items?searchQuery=nonexistent')
        .expect(200);

      expect(response.body.items).toHaveLength(0);
      expect(response.body.pagination.totalItems).toBe(0);
    });

    test('should handle invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/items?pageNumber=invalid')
        .expect(400);

      expect(response.body.error).toContain('Invalid pagination parameters');
    });

    test('should handle invalid limit parameter', async () => {
      const response = await request(app)
        .get('/api/items?itemsPerPage=invalid')
        .expect(400);

      expect(response.body.error).toContain('Invalid pagination parameters');
    });

    test('should handle negative page parameter', async () => {
      const response = await request(app)
        .get('/api/items?pageNumber=-1')
        .expect(400);

      expect(response.body.error).toContain('Invalid pagination parameters');
    });

    test('should handle zero limit parameter', async () => {
      const response = await request(app)
        .get('/api/items?itemsPerPage=0')
        .expect(400);

      expect(response.body.error).toContain('Invalid pagination parameters');
    });
  });

  describe('GET /api/items/:id', () => {
    test('should return specific item by ID', async () => {
      const response = await request(app)
        .get('/api/items/1')
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Laptop Pro');
      expect(response.body.category).toBe('Electronics');
    });

    test('should return 404 for non-existent item', async () => {
      await request(app)
        .get('/api/items/999')
        .expect(404);
    });

    test('should handle invalid ID format', async () => {
      await request(app)
        .get('/api/items/invalid')
        .expect(404);
    });
  });

  describe('GET /api/items/stats/strategy', () => {
    test('should return strategy information', async () => {
      const response = await request(app)
        .get('/api/items/stats/strategy')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('currentStrategy');
      expect(response.body.data).toHaveProperty('fileSize');
      expect(response.body.data).toHaveProperty('hasCache');
    });
  });
}); 