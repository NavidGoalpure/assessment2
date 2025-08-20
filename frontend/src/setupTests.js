// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock fetch globally for all tests
global.fetch = jest.fn();

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: An update to') ||
       args[0].includes('Warning: React does not recognize'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities
global.testUtils = {
  // Helper to create mock API response
  createMockApiResponse: (items = [], page = 1, limit = 10) => {
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
  },

  // Helper to create mock items
  createMockItems: (count = 5) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      category: i % 2 === 0 ? 'Electronics' : 'Furniture',
      price: Math.floor(Math.random() * 1000) + 100
    }));
  },

  // Helper to mock successful fetch response
  mockSuccessfulFetch: (response) => {
    fetch.mockResolvedValue({
      json: async () => response
    });
  },

  // Helper to mock failed fetch response
  mockFailedFetch: (error) => {
    fetch.mockRejectedValue(error);
  }
}; 