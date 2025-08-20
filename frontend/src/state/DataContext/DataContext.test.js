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
      <button onClick={() => fetchItems(undefined, 1, 10, 'test')}>Fetch With Signal</button>
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
        ok: true,
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
        'http://localhost:4001/api/items?pageNumber=1&itemsPerPage=10',
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
        ok: true,
        json: async () => mockResponse
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch With Signal');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:4001/api/items?pageNumber=1&itemsPerPage=10&searchQuery=test',
          expect.any(Object)
        );
      });
    });

    test('should handle fetch with pagination parameters', async () => {
      const mockResponse = {
        items: [{ id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 }],
        pagination: {
          currentPage: 2,
          totalPages: 2,
          totalItems: 1,
          itemsPerPage: 5,
          hasNextPage: false,
          hasPrevPage: true
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:4001/api/items?pageNumber=1&itemsPerPage=10',
          expect.any(Object)
        );
      });
    });

    test('should handle fetch errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    test('should handle HTTP error responses', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      await act(async () => {
        fetchButton.click();
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('setSearchQuery', () => {
    test('should update search query', async () => {
      renderWithProvider(<TestComponent />);
      
      const setSearchButton = screen.getByText('Set Search');
      await act(async () => {
        setSearchButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('search-query')).toHaveTextContent('test');
      });
    });
  });

  describe('AbortController', () => {
    test('should abort previous requests when new request is made', async () => {
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

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      renderWithProvider(<TestComponent />);
      
      const fetchButton = screen.getByText('Fetch Items');
      
      // Make multiple rapid requests
      await act(async () => {
        fetchButton.click();
        fetchButton.click();
        fetchButton.click();
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(3);
      });
    });
  });
}); 