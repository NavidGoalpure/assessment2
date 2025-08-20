const { paginateItems } = require('../../src/utils/Pagination');

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
    { id: 11, name: 'Item 11' },
    { id: 12, name: 'Item 12' }
  ];

  test('should paginate items correctly with default parameters', () => {
    const result = paginateItems(testData, 1, 5);
    
    expect(result.items).toHaveLength(5);
    expect(result.items[0].id).toBe(1);
    expect(result.items[4].id).toBe(5);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.totalItems).toBe(12);
    expect(result.pagination.itemsPerPage).toBe(5);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPrevPage).toBe(false);
  });

  test('should handle second page correctly', () => {
    const result = paginateItems(testData, 2, 5);
    
    expect(result.items).toHaveLength(5);
    expect(result.items[0].id).toBe(6);
    expect(result.items[4].id).toBe(10);
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPrevPage).toBe(true);
  });

  test('should handle last page correctly', () => {
    const result = paginateItems(testData, 3, 5);
    
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(11);
    expect(result.items[1].id).toBe(12);
    expect(result.pagination.currentPage).toBe(3);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPrevPage).toBe(true);
  });

  test('should handle empty array', () => {
    const result = paginateItems([], 1, 10);
    
    expect(result.items).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPrevPage).toBe(false);
  });

  test('should handle page beyond available data', () => {
    const result = paginateItems(testData, 5, 5);
    
    expect(result.items).toHaveLength(0);
    expect(result.pagination.currentPage).toBe(5);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPrevPage).toBe(true);
  });
}); 