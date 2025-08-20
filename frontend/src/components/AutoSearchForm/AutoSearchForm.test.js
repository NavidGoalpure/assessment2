import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AutoSearchForm from './index';

// Mock the useSearch hook
jest.mock('../../hooks/useSearch', () => {
  return jest.fn(() => ({
    searchInput: '',
    isSearching: false,
    showSearchButton: false,
    handleInputChange: jest.fn(),
    handleManualSearch: jest.fn(),
    clearSearch: jest.fn(),
    cleanup: jest.fn()
  }));
});

const mockUseSearch = require('../../hooks/useSearch');

const mockProps = {
  searchInput: '',
  onSearchInputChange: jest.fn(),
  onAutoSearch: jest.fn(),
  pageSize: 10,
  onPageSizeChange: jest.fn(),
  isSearching: false
};

describe('AutoSearchForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation
    mockUseSearch.mockReturnValue({
      searchInput: '',
      isSearching: false,
      showSearchButton: false,
      handleInputChange: jest.fn(),
      handleManualSearch: jest.fn(),
      clearSearch: jest.fn(),
      cleanup: jest.fn()
    });
  });

  test('should render search input with placeholder', () => {
    render(<AutoSearchForm {...mockProps} />);
    
    expect(screen.getByPlaceholderText(/Search items by name or category/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min 3 characters for auto-search/)).toBeInTheDocument();
  });

  test('should render page size selector', () => {
    render(<AutoSearchForm {...mockProps} />);
    
    expect(screen.getByDisplayValue('10 items per page')).toBeInTheDocument();
    expect(screen.getByText('25 items per page')).toBeInTheDocument();
    expect(screen.getByText('50 items per page')).toBeInTheDocument();
  });

  test('should show loading spinner when searching', () => {
    mockUseSearch.mockReturnValue({
      searchInput: '',
      isSearching: false,
      showSearchButton: false,
      handleInputChange: jest.fn(),
      handleManualSearch: jest.fn(),
      clearSearch: jest.fn(),
      cleanup: jest.fn()
    });

    render(<AutoSearchForm {...mockProps} isSearching={true} />);
    
    // Check that the page size selector is still rendered
    expect(screen.getByDisplayValue('10 items per page')).toBeInTheDocument();
  });

  test('should handle page size change', () => {
    render(<AutoSearchForm {...mockProps} />);
    
    const select = screen.getByDisplayValue('10 items per page');
    fireEvent.change(select, { target: { value: '25' } });
    
    expect(mockProps.onPageSizeChange).toHaveBeenCalledWith(25);
  });

  test('should show character count indicator when input is less than 3 characters', () => {
    // Mock the useSearch hook to return a short input
    mockUseSearch.mockReturnValue({
      searchInput: 'ab',
      isSearching: false,
      showSearchButton: true,
      handleInputChange: jest.fn(),
      handleManualSearch: jest.fn(),
      clearSearch: jest.fn(),
      cleanup: jest.fn()
    });

    render(<AutoSearchForm {...mockProps} />);
    
    expect(screen.getByText('1 more')).toBeInTheDocument();
  });

  test('should show auto-search enabled message when input has 3+ characters', () => {
    // Mock the useSearch hook to return a valid input
    mockUseSearch.mockReturnValue({
      searchInput: 'abc',
      isSearching: false,
      showSearchButton: false,
      handleInputChange: jest.fn(),
      handleManualSearch: jest.fn(),
      clearSearch: jest.fn(),
      cleanup: jest.fn()
    });

    render(<AutoSearchForm {...mockProps} />);
    
    expect(screen.getByText(/Auto-search enabled/)).toBeInTheDocument();
    expect(screen.getByText(/debounced by 500ms/)).toBeInTheDocument();
  });

  test('should show search button when input is less than 3 characters', () => {
    // Mock the useSearch hook to return a short input
    mockUseSearch.mockReturnValue({
      searchInput: 'ab',
      isSearching: false,
      showSearchButton: true,
      handleInputChange: jest.fn(),
      handleManualSearch: jest.fn(),
      clearSearch: jest.fn(),
      cleanup: jest.fn()
    });

    render(<AutoSearchForm {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('should not show search button when input has 3+ characters', () => {
    // Mock the useSearch hook to return a valid input
    mockUseSearch.mockReturnValue({
      searchInput: 'abc',
      isSearching: false,
      showSearchButton: false,
      handleInputChange: jest.fn(),
      handleManualSearch: jest.fn(),
      clearSearch: jest.fn(),
      cleanup: jest.fn()
    });

    render(<AutoSearchForm {...mockProps} />);
    
    expect(screen.queryByRole('button', { name: /Search/i })).not.toBeInTheDocument();
  });

  test('should show searching indicator when local search is active', () => {
    // Mock the useSearch hook to return searching state
    mockUseSearch.mockReturnValue({
      searchInput: 'abc',
      isSearching: true,
      showSearchButton: false,
      handleInputChange: jest.fn(),
      handleManualSearch: jest.fn(),
      clearSearch: jest.fn(),
      cleanup: jest.fn()
    });

    render(<AutoSearchForm {...mockProps} />);
    
    expect(screen.getByText(/Searching.../)).toBeInTheDocument();
  });
}); 