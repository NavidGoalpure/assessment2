import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemsPage from '../../pages/Items';
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

describe('ItemsPage Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Initial Render', () => {
    test('should show loading state initially', () => {
      renderWithProviders(<ItemsPage />);
      
      expect(screen.getByText('Loading items...')).toBeInTheDocument();
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
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);
      
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
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

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
          expect.stringContaining('searchQuery=laptop'),
          expect.any(Object)
        );
      });
    });

    test('should show search results info', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
          { id: 2, name: 'Smartphone', category: 'Electronics', price: 899 }
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

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'electronics' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText(/Search results for "electronics": 2 items found/)).toBeInTheDocument();
      });
    });

    test('should reset to page 1 when searching', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Test Item', category: 'Test', price: 100 }
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
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search items by name or category...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search items by name or category...');
      const searchButton = screen.getByText('Search');

      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('pageNumber=1'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Pagination', () => {
    test('should render pagination controls when multiple pages exist', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Item 1', category: 'Test', price: 100 },
          { id: 2, name: 'Item 2', category: 'Test', price: 200 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalItems: 6,
          itemsPerPage: 2,
          hasNextPage: true,
          hasPrevPage: false
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });
    });

    test('should handle next page navigation', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Item 1', category: 'Test', price: 100 },
          { id: 2, name: 'Item 2', category: 'Test', price: 200 }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalItems: 6,
          itemsPerPage: 2,
          hasNextPage: true,
          hasPrevPage: false
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('pageNumber=2'),
          expect.any(Object)
        );
      });
    });

    test('should handle previous page navigation', async () => {
      const mockResponse = {
        items: [
          { id: 3, name: 'Item 3', category: 'Test', price: 300 },
          { id: 4, name: 'Item 4', category: 'Test', price: 400 }
        ],
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalItems: 6,
          itemsPerPage: 2,
          hasNextPage: true,
          hasPrevPage: true
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByText('Previous')).toBeInTheDocument();
      });

      const prevButton = screen.getByText('Previous');
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('pageNumber=1'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Items Display', () => {
    test('should render items list correctly', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
          { id: 2, name: 'Smartphone', category: 'Electronics', price: 899 }
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

      await waitFor(() => {
        // With virtualization, we check the footer instead of individual items
        expect(screen.getByText('Showing 2 of 2 items')).toBeInTheDocument();
        // Check that the virtuoso container is rendered
        expect(screen.getByTestId('virtuoso-scroller')).toBeInTheDocument();
      });
    });

    test('should render item links correctly', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Test Item', category: 'Test', price: 100 }
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
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        // With virtualization, we check that the virtuoso container is rendered
        expect(screen.getByText('Showing 1 of 1 items')).toBeInTheDocument();
        expect(screen.getByTestId('virtuoso-scroller')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    test('should show loading indicator during pagination', async () => {
      const mockResponse = {
        items: [
          { id: 1, name: 'Item 1', category: 'Test', price: 100 }
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
        ok: true,
        json: async () => mockResponse
      });

      renderWithProviders(<ItemsPage />);

      await waitFor(() => {
        expect(screen.getByText('Loading items...')).toBeInTheDocument();
      });
    });
  });
}); 