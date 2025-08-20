const { filterItems } = require('../../src/utils/Search');

describe('Search Utility', () => {
  const testData = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999, description: 'High-performance laptop' },
    { id: 2, name: 'Chair', category: 'Furniture', price: 199, description: 'Comfortable office chair' },
    { id: 3, name: 'Phone', category: 'Electronics', price: 599, description: 'Smartphone with camera' },
    { id: 4, name: 'Table', category: 'Furniture', price: 299, description: 'Wooden dining table' },
    { id: 5, name: 'Monitor', category: 'Electronics', price: 399, description: '4K display monitor' }
  ];

  describe('filterItems', () => {
    test('should return all items when search query is empty', () => {
      const result = filterItems(testData, '');
      expect(result).toEqual(testData);
    });

    test('should return all items when search query is null or undefined', () => {
      expect(filterItems(testData, null)).toEqual(testData);
      expect(filterItems(testData, undefined)).toEqual(testData);
    });

    test('should search by name (case-insensitive)', () => {
      const result = filterItems(testData, 'laptop');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Laptop');
    });

    test('should search by category (case-insensitive)', () => {
      const result = filterItems(testData, 'electronics');
      expect(result).toHaveLength(3);
      expect(result.every(item => item.category === 'Electronics')).toBe(true);
    });

    test('should search by description (case-insensitive)', () => {
      const result = filterItems(testData, 'camera');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Phone');
    });

    test('should search across multiple fields', () => {
      const result = filterItems(testData, 'office');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Chair');
    });

    test('should handle partial matches', () => {
      const result = filterItems(testData, 'lap');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Laptop');
    });

    test('should return empty array for no matches', () => {
      const result = filterItems(testData, 'nonexistent');
      expect(result).toEqual([]);
    });

    test('should handle special characters in search query', () => {
      const result = filterItems(testData, '4K');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Monitor');
    });

    test('should handle numbers in search query', () => {
      const result = filterItems(testData, '4K');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Monitor');
    });

    test('should handle empty data array', () => {
      const result = filterItems([], 'test');
      expect(result).toEqual([]);
    });

    test('should handle items with missing properties', () => {
      const incompleteData = [
        { id: 1, name: 'Test Item' },
        { id: 2, category: 'Electronics' },
        { id: 3, price: 100 }
      ];

      const result = filterItems(incompleteData, 'test');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Item');
    });

    test('should handle items with null/undefined properties', () => {
      const dataWithNulls = [
        { id: 1, name: 'Test Item', category: null, description: undefined },
        { id: 2, name: null, category: 'Electronics', description: 'Test description' }
      ];

      const result = filterItems(dataWithNulls, 'test');
      expect(result).toHaveLength(2);
    });
  });
}); 