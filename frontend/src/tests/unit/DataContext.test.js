import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DataProvider, useData } from '../../state/DataContext';

// Mock fetch globally
global.fetch = jest.fn();

// Test component to access context
const TestComponent = () => {
  const { items, pagination, loading, searchQuery, fetchItems, setSearchQuery } = useData();
  
  return (
    <div>
      <div data-testid="items-count">{items.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="search-query">{searchQuery}</div>
      <div data-testid="current-page">{pagination.currentPage}</div>
      <div data-testid="total-pages">{pagination.totalPages}</div>
      <button onClick={() => fetchItems()}>Fetch Items</button>
      <button onClick={() => setSearchQuery('test')}>Set Search</button>
    </div>
  );
};

const renderWithProvider = (component) => {
  return render(
    <DataProvider>
      {component}
    </DataProvider>
  );
};

describe('DataContext', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Initial State', () => {
    test('should have correct initial state', () => {
      renderWithProvider(<TestComponent />);
      
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('search-query')).toHaveTextContent('');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('total-pages')).toHaveTextContent('1');
    });
  });

  describe('fetchItems', () => {
    test('should fetch items successfully', async () => {
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
        json: async () => mockResponse
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('items-count')).toHaveTextContent('2');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('current-page')).toHaveTextContent('1');
        expect(screen.getByTestId('total-pages')).toHaveTextContent('1');
      });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4001/api/items?page=1&limit=10',
        expect.any(Object)
      );
    });

    test('should handle fetch with search query', async () => {
      const mockResponse = {
        items: [{ id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 }],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:4001/api/items?page=1&limit=10',
          expect.any(Object)
        );
      });
    });

    test('should handle fetch with pagination parameters', async () => {
      const mockResponse = {
        items: [{ id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 }],
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPrevPage: true
        }
      };

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:4001/api/items?page=1&limit=10',
          expect.any(Object)
        );
      });
    });

    test('should handle fetch error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching items:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('should handle AbortError gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const abortError = new Error('AbortError');
      abortError.name = 'AbortError';
      fetch.mockRejectedValueOnce(abortError);

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(consoleSpy).not.toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    test('should set loading state correctly', async () => {
      let resolveFetch;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      fetch.mockReturnValueOnce(fetchPromise);

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      // Should be loading
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // Resolve the fetch
      await act(async () => {
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
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });
  });

  describe('setSearchQuery', () => {
    test('should update search query', () => {
      renderWithProvider(<TestComponent />);
      
      const searchButton = screen.getByText('Set Search');
      act(() => {
        searchButton.click();
      });

      expect(screen.getByTestId('search-query')).toHaveTextContent('test');
    });
  });

  describe('AbortController Integration', () => {
    test('should pass AbortSignal to fetch', async () => {
      const mockResponse = {
        items: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      };

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            signal: expect.any(AbortSignal)
          })
        );
      });
    });
  });
}); 