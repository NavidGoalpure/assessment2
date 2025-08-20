const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Create a test app
const app = express();
app.use(express.json());

// Mock the data file for testing
const TEST_DATA_PATH = path.join(__dirname, '../../test-data.json');
const ORIGINAL_DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Setup test data
const testData = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
  { id: 2, name: 'Noise Cancelling Headphones', category: 'Electronics', price: 399 },
  { id: 3, name: 'Ultra-Wide Monitor', category: 'Electronics', price: 999 },
  { id: 4, name: 'Ergonomic Chair', category: 'Furniture', price: 799 },
  { id: 5, name: 'Standing Desk', category: 'Furniture', price: 1199 },
  { id: 6, name: 'Wireless Mouse', category: 'Electronics', price: 49 },
  { id: 7, name: 'Mechanical Keyboard', category: 'Electronics', price: 129 },
  { id: 8, name: 'Office Lamp', category: 'Furniture', price: 89 },
  { id: 9, name: 'Webcam HD', category: 'Electronics', price: 79 },
  { id: 10, name: 'Desk Organizer', category: 'Furniture', price: 29 },
  { id: 11, name: 'USB-C Hub', category: 'Electronics', price: 59 },
  { id: 12, name: 'Monitor Stand', category: 'Furniture', price: 149 }
];

// Mock the readData function
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn()
}));

// Import routes after mocking
const itemsRouter = require('../../src/routes/items');
app.use('/api/items', itemsRouter);

describe('Items API Integration Tests', () => {
  beforeAll(() => {
    // Write test data to file
    fs.writeFileSync(TEST_DATA_PATH, JSON.stringify(testData, null, 2));
  });

  beforeEach(() => {
    // Mock readFileSync to return test data
    fs.readFileSync.mockReturnValue(JSON.stringify(testData));
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(TEST_DATA_PATH)) {
      fs.unlinkSync(TEST_DATA_PATH);
    }
  });

  describe('GET /api/items', () => {
    test('should return all items with default pagination', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.items).toHaveLength(10); // default limit
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(2);
      expect(response.body.pagination.totalItems).toBe(12);
      expect(response.body.pagination.itemsPerPage).toBe(10);
    });

    test('should return paginated results', async () => {
      const response = await request(app)
        .get('/api/items?page=2&limit=5')
        .expect(200);

      expect(response.body.items).toHaveLength(5);
      expect(response.body.pagination.currentPage).toBe(2);
      expect(response.body.pagination.totalPages).toBe(3);
      expect(response.body.pagination.hasNextPage).toBe(true);
      expect(response.body.pagination.hasPrevPage).toBe(true);
    });

    test('should return search results', async () => {
      const response = await request(app)
        .get('/api/items?q=electronics')
        .expect(200);

      expect(response.body.items).toHaveLength(7);
      expect(response.body.pagination.totalItems).toBe(7);
      expect(response.body.items.every(item => 
        item.category === 'Electronics' || 
        item.name.toLowerCase().includes('electronics')
      )).toBe(true);
    });

    test('should return search results with pagination', async () => {
      const response = await request(app)
        .get('/api/items?q=electronics&page=1&limit=3')
        .expect(200);

      expect(response.body.items).toHaveLength(3);
      expect(response.body.pagination.totalItems).toBe(7);
      expect(response.body.pagination.totalPages).toBe(3);
      expect(response.body.pagination.hasNextPage).toBe(true);
    });

    test('should handle case-insensitive search', async () => {
      const response = await request(app)
        .get('/api/items?q=ELECTRONICS')
        .expect(200);

      expect(response.body.items).toHaveLength(7);
      expect(response.body.items.every(item => item.category === 'Electronics')).toBe(true);
    });

    test('should handle empty search query', async () => {
      const response = await request(app)
        .get('/api/items?q=')
        .expect(200);

      expect(response.body.items).toHaveLength(10);
      expect(response.body.pagination.totalItems).toBe(12);
    });

    test('should handle non-existent search query', async () => {
      const response = await request(app)
        .get('/api/items?q=nonexistent')
        .expect(200);

      expect(response.body.items).toHaveLength(0);
      expect(response.body.pagination.totalItems).toBe(0);
      expect(response.body.pagination.totalPages).toBe(0);
    });

    test('should handle invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/items?page=invalid&limit=5')
        .expect(200);

      expect(response.body.items).toHaveLength(0);
      expect(response.body.pagination.currentPage).toBe(null);
    });

    test('should handle page beyond total pages', async () => {
      const response = await request(app)
        .get('/api/items?page=10&limit=5')
        .expect(200);

      expect(response.body.items).toHaveLength(0);
      expect(response.body.pagination.currentPage).toBe(10);
      expect(response.body.pagination.hasNextPage).toBe(false);
    });
  });

  describe('GET /api/items/:id', () => {
    test('should return item by id', async () => {
      const response = await request(app)
        .get('/api/items/1')
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        name: 'Laptop Pro',
        category: 'Electronics',
        price: 2499
      });
    });

    test('should return 404 for non-existent item', async () => {
      await request(app)
        .get('/api/items/999')
        .expect(404);
    });

    test('should handle invalid id parameter', async () => {
      await request(app)
        .get('/api/items/invalid')
        .expect(404);
    });
  });

  describe('POST /api/items', () => {
    test('should create new item', async () => {
      const newItem = {
        name: 'Test Item',
        category: 'Test Category',
        price: 100
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.category).toBe(newItem.category);
      expect(response.body.price).toBe(newItem.price);
    });

    test('should handle missing required fields', async () => {
      const incompleteItem = {
        name: 'Test Item'
        // missing category and price
      };

      await request(app)
        .post('/api/items')
        .send(incompleteItem)
        .expect(201); // Currently accepts incomplete data (intentional bug)
    });
  });

  describe('Error Handling', () => {
    test('should handle file read errors', async () => {
      // Mock file read error
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      await request(app)
        .get('/api/items')
        .expect(500);
    });

    test('should handle malformed JSON in data file', async () => {
      // Mock malformed JSON
      fs.readFileSync.mockReturnValue('invalid json');

      await request(app)
        .get('/api/items')
        .expect(500);
    });
  });
}); 