import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemsPage from './index';
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

  describe('Initial Load and Basic Functionality', () => {
    test('should load and display items on initial render', async () => {
      const mockResponse = {
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

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      // Wait for the search input to appear (indicating the page has loaded)
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/)).toBeInTheDocument();
      });

      // Check that the Hero section is present
      expect(screen.getByText('🛍️ Discover Amazing Products')).toBeInTheDocument();
      expect(screen.getByText('🚀 Ready to Explore?')).toBeInTheDocument();

      // Verify fetch was called
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/items?pageNumber=1&itemsPerPage=10'),
        expect.any(Object)
      );
    });

    test('should handle search functionality', async () => {
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

      const searchResponse = {
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
        .mockResolvedValueOnce({
          ok: true,
          json: async () => initialResponse
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => searchResponse
        });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/);

      // Type search query (should trigger auto-search after 3 characters)
      fireEvent.change(searchInput, { target: { value: 'laptop' } });

      await waitFor(() => {
        expect(screen.getByText(/Search results for "laptop": 1 items found/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    test('should handle pagination controls', async () => {
      const page1Response = {
        items: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          category: 'Electronics',
          price: 100 + i
        })),
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalItems: 15,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPrevPage: false
        }
      };

      const page2Response = {
        items: Array.from({ length: 5 }, (_, i) => ({
          id: i + 11,
          name: `Item ${i + 11}`,
          category: 'Electronics',
          price: 100 + i + 10
        })),
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
          ok: true,
          json: async () => page1Response
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page2Response
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page1Response
        });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/)).toBeInTheDocument();
      });

      // Navigate to next page
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
      });

      // Navigate back to first page
      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<ItemsPage />);

      // Wait for component to finish loading (even after error)
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/)).toBeInTheDocument();
      });

      // Component should still be interactive after error
      const searchInput = screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/);

      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        // Initial load + 1 search call
        expect(fetch).toHaveBeenCalledTimes(3);
      }, { timeout: 2000 });
    });
  });

  describe('Performance and UX', () => {
    test('should show loading states appropriately', async () => {
      let resolveFetch;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      fetch.mockReturnValueOnce(fetchPromise);

      renderWithProviders(<ItemsPage />);

      // Should show loading initially
      expect(screen.getByText('Loading items...')).toBeInTheDocument();

      // Resolve the fetch
      await act(async () => {
        resolveFetch({
          ok: true,
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

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/)).toBeInTheDocument();
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
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search items by name or category.*min 3 characters for auto-search/);

      // Perform rapid searches - only the last one should trigger due to debouncing
      fireEvent.change(searchInput, { target: { value: 'test1' } });
      fireEvent.change(searchInput, { target: { value: 'test2' } });
      fireEvent.change(searchInput, { target: { value: 'test3' } });

      // Should handle multiple requests without crashing
      await waitFor(() => {
        // Initial load + 1 debounced search (the last one)
        expect(fetch).toHaveBeenCalledTimes(3);
      }, { timeout: 3000 });
    });
  });
}); 