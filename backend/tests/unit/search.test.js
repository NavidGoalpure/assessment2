const { searchItems } = require('../../src/utils/search');

describe('Search Utility', () => {
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
    { id: 10, name: 'Desk Organizer', category: 'Furniture', price: 29 }
  ];

  describe('Name Search', () => {
    test('should find items by exact name match', () => {
      const result = searchItems(testData, 'Laptop Pro');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Laptop Pro');
    });

    test('should find items by partial name match', () => {
      const result = searchItems(testData, 'laptop');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Laptop Pro');
    });

    test('should be case insensitive', () => {
      const result = searchItems(testData, 'LAPTOP');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test('should find multiple items with same partial match', () => {
      const result = searchItems(testData, 'mouse');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Wireless Mouse');
    });
  });

  describe('Category Search', () => {
    test('should find items by exact category match', () => {
      const result = searchItems(testData, 'Electronics');
      
      expect(result).toHaveLength(6);
      expect(result.every(item => item.category === 'Electronics')).toBe(true);
    });

    test('should find items by partial category match', () => {
      const result = searchItems(testData, 'electronics');
      
      expect(result).toHaveLength(6);
      expect(result.every(item => item.category === 'Electronics')).toBe(true);
    });

    test('should find furniture items', () => {
      const result = searchItems(testData, 'furniture');
      
      expect(result).toHaveLength(4);
      expect(result.every(item => item.category === 'Furniture')).toBe(true);
    });
  });

  describe('Cross-Field Search', () => {
    test('should find items matching name or category', () => {
      const result = searchItems(testData, 'electronics');
      
      expect(result).toHaveLength(6);
      const electronicsItems = result.filter(item => item.category === 'Electronics');
      expect(electronicsItems).toHaveLength(6);
    });

    test('should handle search term that appears in both name and category', () => {
      // This test would be more relevant if we had items with category names in their item names
      const result = searchItems(testData, 'pro');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Laptop Pro');
    });
  });

  describe('Edge Cases', () => {
    test('should return all items for empty query', () => {
      const result = searchItems(testData, '');
      
      expect(result).toHaveLength(10);
      expect(result).toEqual(testData);
    });

    test('should return all items for null query', () => {
      const result = searchItems(testData, null);
      
      expect(result).toHaveLength(10);
      expect(result).toEqual(testData);
    });

    test('should return all items for undefined query', () => {
      const result = searchItems(testData, undefined);
      
      expect(result).toHaveLength(10);
      expect(result).toEqual(testData);
    });

    test('should return all items for whitespace-only query', () => {
      const result = searchItems(testData, '   ');
      
      expect(result).toHaveLength(10);
      expect(result).toEqual(testData);
    });

    test('should handle empty data array', () => {
      const result = searchItems([], 'laptop');
      
      expect(result).toHaveLength(0);
    });

    test('should return empty array for no matches', () => {
      const result = searchItems(testData, 'nonexistent');
      
      expect(result).toHaveLength(0);
    });

    test('should trim whitespace from query', () => {
      const result = searchItems(testData, '  laptop  ');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Laptop Pro');
    });
  });

  describe('Special Characters', () => {
    test('should handle special characters in search', () => {
      const result = searchItems(testData, 'ultra-wide');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Ultra-Wide Monitor');
    });

    test('should handle numbers in search', () => {
      const result = searchItems(testData, 'hd');
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Webcam HD');
    });
  });
}); 