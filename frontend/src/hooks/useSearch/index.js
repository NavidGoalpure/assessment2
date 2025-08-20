import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for managing search functionality with memory management
 * @param {Function} onSearch - Function to call when search is triggered
 * @param {number} minCharacters - Minimum characters required for search
 * @param {number} debounceDelay - Debounce delay in milliseconds
 * @returns {Object} - Search state and handlers
 */
const useSearch = (onSearch, minCharacters = 3, debounceDelay = 500) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Show search button if input is less than minimum characters
    setShowSearchButton(value.length > 0 && value.length < minCharacters);

    // Auto-search if input has minimum characters
    if (value.length >= minCharacters) {
      setShowSearchButton(false);
      debounceTimeoutRef.current = setTimeout(() => {
        // Abort previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();
        
        // Trigger search
        setIsSearching(true);
        onSearch(value, abortControllerRef.current.signal)
          .finally(() => setIsSearching(false));
      }, debounceDelay);
    } else if (value.length === 0) {
      // Clear search when input is empty
      setShowSearchButton(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      onSearch('', null);
    }
  }, [onSearch, minCharacters, debounceDelay]);

  // Handle manual search button click
  const handleManualSearch = useCallback((e) => {
    e.preventDefault();
    if (searchInput.length > 0) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      setIsSearching(true);
      onSearch(searchInput, abortControllerRef.current.signal)
        .finally(() => setIsSearching(false));
    }
  }, [searchInput, onSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchInput('');
    setShowSearchButton(false);
    cleanup();
    onSearch('', null);
  }, [cleanup, onSearch]);

  return {
    searchInput,
    isSearching,
    showSearchButton,
    handleInputChange,
    handleManualSearch,
    clearSearch,
    cleanup
  };
};

export default useSearch; 