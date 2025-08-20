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

describe('Items Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Initial Render', () => {
    test('should show loading state initially', () => {
      renderWithProviders(<Items />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should render search form after loading', async () => {
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

      renderWithProviders(<Items />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    test('should handle search form submission', async () => {
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

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProviders(<Items />);

      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'laptop' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('q=laptop'),
          expect.any(Object)
        );
      });
    });

    test('should show search results info', async () => {
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

      renderWithProviders(<Items />);

      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'electronics' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Search results for "electronics": 2 items found')).toBeInTheDocument();
      });
    });

    test('should reset to page 1 when searching', async () => {
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

      renderWithProviders(<Items />);

      // Wait for the component to finish loading
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=1'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Pagination', () => {
    test('should render pagination controls when multiple pages exist', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Item 1', category: 'Electronics', price: 100 },
          { id: 2, name: 'Item 2', category: 'Electronics', price: 200 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalItems: 25,
          itemsPerPage: 10,
          hasNextPage: true,
          hasPrevPage: false
        }
      };

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });
    });

    test('should not render pagination controls for single page', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Item 1', category: 'Electronics', price: 100 }
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

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(screen.queryByText('Previous')).not.toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
      });
    });

    test('should handle next page navigation', async () => {
      const mockResponse1 = {
        items: [
          { id: 1, name: 'Item 1', category: 'Electronics', price: 100 },
          { id: 2, name: 'Item 2', category: 'Electronics', price: 200 }
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

      const mockResponse2 = {
        items: [
          { id: 11, name: 'Item 11', category: 'Electronics', price: 1100 }
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
          json: async () => mockResponse1
        })
        .mockResolvedValueOnce({
          json: async () => mockResponse2
        });

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=2'),
          expect.any(Object)
        );
      });
    });

    test('should handle previous page navigation', async () => {
      const mockResponse1 = {
        items: [
          { id: 11, name: 'Item 11', category: 'Electronics', price: 1100 }
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

      const mockResponse2 = {
        items: [
          { id: 1, name: 'Item 1', category: 'Electronics', price: 100 },
          { id: 2, name: 'Item 2', category: 'Electronics', price: 200 }
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

      fetch
        .mockResolvedValueOnce({
          json: async () => mockResponse1
        })
        .mockResolvedValueOnce({
          json: async () => mockResponse2
        });

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
      });

      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=1'),
          expect.any(Object)
        );
      });
    });

    test('should disable navigation buttons appropriately', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Item 1', category: 'Electronics', price: 100 }
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

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(screen.queryByText('Previous')).not.toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
      });
    });
  });

  describe('Items Display', () => {
    test('should render items list correctly', async () => {
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

      renderWithProviders(<Items />);

      await waitFor(() => {
        // With virtualization, we check the footer instead of individual items
        expect(screen.getByText('Showing 2 of 2 items')).toBeInTheDocument();
        // Check that the virtuoso container is rendered
        expect(screen.getByTestId('virtuoso-scroller')).toBeInTheDocument();
      });
    });

    test('should render "No items found" when no results', async () => {
      const mockResponse = {
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

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(screen.getByText('No items found.')).toBeInTheDocument();
      });
    });

    test('should render item links correctly', async () => {
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

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      renderWithProviders(<Items />);

      await waitFor(() => {
        // With virtualization, we check that the virtuoso container is rendered
        expect(screen.getByTestId('virtuoso-scroller')).toBeInTheDocument();
        expect(screen.getByText('Showing 1 of 1 items')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    test('should show loading indicator during pagination', async () => {
      let resolveFetch;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });

      fetch.mockReturnValueOnce(fetchPromise);

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

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
    });
  });

  describe('Error Handling', () => {
    test('should handle fetch errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<Items />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });
}); 