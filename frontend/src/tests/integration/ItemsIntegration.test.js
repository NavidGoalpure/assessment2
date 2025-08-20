import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Items from '../../pages/Items';
import { DataProvider } from '../../state/DataContext';

// Mock fetch globally
global.fetch = jest.fn();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <DataProvider>
        {component}
      </DataProvider>
    </BrowserRouter>
  );
};

describe('Items Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Complete User Workflow', () => {
    test('should handle complete search and pagination workflow', async () => {
      // Mock responses for different scenarios
      const initialResponse = {
        items: [
          { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
          { id: 2, name: 'Mouse', category: 'Electronics', price: 49 },
          { id: 3, name: 'Keyboard', category: 'Electronics', price: 129 },
          { id: 4, name: 'Monitor', category: 'Electronics', price: 999 },
          { id: 5, name: 'Headphones', category: 'Electronics', price: 399 },
          { id: 6, name: 'Webcam', category: 'Electronics', price: 79 },
          { id: 7, name: 'Speaker', category: 'Electronics', price: 199 },
          { id: 8, name: 'Microphone', category: 'Electronics', price: 149 },
          { id: 9, name: 'Tablet', category: 'Electronics', price: 899 },
          { id: 10, name: 'Phone', category: 'Electronics', price: 1299 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalItems: 15,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPrevPage: false
        }
      };

      const searchResponse = {
        items: [
          { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
          { id: 2, name: 'Mouse', category: 'Electronics', price: 49 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };

      const page2Response = {
        items: [
          { id: 11, name: 'Camera', category: 'Electronics', price: 599 },
          { id: 12, name: 'Printer', category: 'Electronics', price: 299 },
          { id: 13, name: 'Scanner', category: 'Electronics', price: 199 },
          { id: 14, name: 'Router', category: 'Electronics', price: 89 },
          { id: 15, name: 'Switch', category: 'Electronics', price: 159 }
        ],
        pagination: {
          currentPage: 2,
          totalPages: 2,
          totalItems: 15,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: true
        }
      };

      fetch
        .mockResolvedValueOnce({
          json: async () => initialResponse
        })
        .mockResolvedValueOnce({
          json: async () => searchResponse
        })
        .mockResolvedValueOnce({
          json: async () => initialResponse
        })
        .mockResolvedValueOnce({
          json: async () => page2Response
        })
        .mockResolvedValueOnce({
          json: async () => initialResponse
        });

      renderWithProviders(<Items />);

      // Step 1: Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });

      // Step 2: Perform search
      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'laptop' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Search results for "laptop": 2 items found')).toBeInTheDocument();
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
        expect(screen.getByText('Mouse')).toBeInTheDocument();
        expect(screen.queryByText('Keyboard')).not.toBeInTheDocument();
      });

      // Step 3: Clear search and navigate to page 2
      fireEvent.change(searchInput, { target: { value: '' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Camera')).toBeInTheDocument();
        expect(screen.getByText('Printer')).toBeInTheDocument();
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
        expect(screen.getByText('Previous')).toBeInTheDocument();
      });

      // Step 4: Navigate back to page 1
      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });
    });

    test('should handle search with no results and then clear search', async () => {
      const initialResponse = {
        items: [
          { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
          { id: 2, name: 'Mouse', category: 'Electronics', price: 49 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };

      const noResultsResponse = {
        items: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };

      fetch
        .mockResolvedValueOnce({
          json: async () => initialResponse
        })
        .mockResolvedValueOnce({
          json: async () => noResultsResponse
        })
        .mockResolvedValueOnce({
          json: async () => initialResponse
        });

      renderWithProviders(<Items />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
      });

      // Search for non-existent item
      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('No items found.')).toBeInTheDocument();
      });

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
        expect(screen.queryByText('No items found.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Memory Leak Prevention', () => {
    test('should cancel fetch requests when component unmounts', async () => {
      let resolveFetch;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      fetch.mockReturnValueOnce(fetchPromise);

      const { unmount } = renderWithProviders(<Items />);

      // Wait for fetch to be called
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });

      // Unmount component before fetch resolves
      unmount();

      // Resolve the fetch after unmount
      resolveFetch({
        json: async () => ({
          items: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
            hasNextPage: false,
            hasPrevPage: false
          }
        })
      });

      // Wait a bit to ensure no errors occur
      await new Promise(resolve => setTimeout(resolve, 100));
    });
  });

  describe('Error Recovery', () => {
    test('should recover from network errors and allow retry', async () => {
      const errorResponse = new Error('Network error');
      const successResponse = {
        items: [
          { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };

      fetch
        .mockRejectedValueOnce(errorResponse)
        .mockResolvedValueOnce({
          json: async () => successResponse
        });

      renderWithProviders(<Items />);

      // Wait for initial error
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      // Wait for component to finish loading (even after error)
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
      });

      // Component should still be interactive after error
      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Performance and UX', () => {
    test('should show loading states appropriately', async () => {
      let resolveFetch;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      fetch.mockReturnValueOnce(fetchPromise);

      renderWithProviders(<Items />);

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Resolve the fetch
      await act(async () => {
        resolveFetch({
          json: async () => ({
            items: [
              { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 }
            ],
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: 1,
              itemsPerPage: 10,
              hasNextPage: false,
              hasPrevPage: false
            }
          })
        });
      });

      // Should not show loading after data loads
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    test('should handle rapid user interactions gracefully', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };

      fetch.mockResolvedValue({
        json: async () => mockResponse
      });

      renderWithProviders(<Items />);

      // Wait for component to finish loading
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      // Rapid search interactions
      fireEvent.change(searchInput, { target: { value: 'test1' } });
      fireEvent.click(searchButton);
      
      fireEvent.change(searchInput, { target: { value: 'test2' } });
      fireEvent.click(searchButton);
      
      fireEvent.change(searchInput, { target: { value: 'test3' } });
      fireEvent.click(searchButton);

      // Should handle multiple requests without crashing
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(4); // Initial + 3 searches
      });
    });
  });
}); 