// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Clean up any global test state
});

// Global test utilities
global.testUtils = {
  // Helper to create mock data
  createMockItems: (count = 5) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      category: i % 2 === 0 ? 'Electronics' : 'Furniture',
      price: Math.floor(Math.random() * 1000) + 100
    }));
  },

  // Helper to create mock pagination response
  createMockPaginationResponse: (items, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / limit);

    return {
      items: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: items.length,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }
}; 