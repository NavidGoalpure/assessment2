const { paginateResults } = require('../../src/utils/pagination');

describe('Pagination Utility', () => {
  const testData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 9, name: 'Item 9' },
    { id: 10, name: 'Item 10' },
    { id: 11, name: 'Item 11' }
  ];

  describe('Basic Pagination', () => {
    test('should return first page with default limit', () => {
      const result = paginateResults(testData, 1);
      
      expect(result.items).toHaveLength(10);
      expect(result.items[0].id).toBe(1);
      expect(result.items[9].id).toBe(10);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.totalItems).toBe(11);
      expect(result.pagination.itemsPerPage).toBe(10);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(false);
    });

    test('should return second page with custom limit', () => {
      const result = paginateResults(testData, 2, 5);
      
      expect(result.items).toHaveLength(5);
      expect(result.items[0].id).toBe(6);
      expect(result.items[4].id).toBe(10);
      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.totalItems).toBe(11);
      expect(result.pagination.itemsPerPage).toBe(5);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(true);
    });

    test('should return last page correctly', () => {
      const result = paginateResults(testData, 3, 5);
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(11);
      expect(result.pagination.currentPage).toBe(3);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPrevPage).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty array', () => {
      const result = paginateResults([], 1, 10);
      
      expect(result.items).toHaveLength(0);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(0);
      expect(result.pagination.totalItems).toBe(0);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPrevPage).toBe(false);
    });

    test('should handle page number as string', () => {
      const result = paginateResults(testData, '2', '5');
      
      expect(result.items).toHaveLength(5);
      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.itemsPerPage).toBe(5);
    });

    test('should handle page beyond total pages', () => {
      const result = paginateResults(testData, 10, 5);
      
      expect(result.items).toHaveLength(0);
      expect(result.pagination.currentPage).toBe(10);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(false);
    });

    test('should handle zero limit', () => {
      const result = paginateResults(testData, 1, 0);
      
      expect(result.items).toHaveLength(10); // Should default to 10
      expect(result.pagination.itemsPerPage).toBe(10); // Should default to 10
    });
  });

  describe('Pagination Metadata', () => {
    test('should calculate total pages correctly', () => {
      const result1 = paginateResults(testData, 1, 5);
      expect(result1.pagination.totalPages).toBe(3);

      const result2 = paginateResults(testData, 1, 10);
      expect(result2.pagination.totalPages).toBe(2);

      const result3 = paginateResults(testData, 1, 11);
      expect(result3.pagination.totalPages).toBe(1);
    });

    test('should set navigation flags correctly', () => {
      const firstPage = paginateResults(testData, 1, 5);
      expect(firstPage.pagination.hasPrevPage).toBe(false);
      expect(firstPage.pagination.hasNextPage).toBe(true);

      const middlePage = paginateResults(testData, 2, 5);
      expect(middlePage.pagination.hasPrevPage).toBe(true);
      expect(middlePage.pagination.hasNextPage).toBe(true);

      const lastPage = paginateResults(testData, 3, 5);
      expect(lastPage.pagination.hasPrevPage).toBe(true);
      expect(lastPage.pagination.hasNextPage).toBe(false);
    });
  });
}); 