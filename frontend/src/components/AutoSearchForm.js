import React, { useEffect } from 'react';
import useSearch from '../hooks/useSearch';

const AutoSearchForm = ({ 
  searchInput, 
  onSearchInputChange, 
  onAutoSearch, 
  pageSize, 
  onPageSizeChange,
  isSearching = false
}) => {
  // Minimum characters required for auto-search
  const MIN_CHARACTERS = 3;
  // Debounce delay in milliseconds
  const DEBOUNCE_DELAY = 500;

  // Use custom search hook
  const {
    searchInput: localSearchInput,
    isSearching: localIsSearching,
    showSearchButton,
    handleInputChange,
    handleManualSearch,
    cleanup
  } = useSearch(onAutoSearch, MIN_CHARACTERS, DEBOUNCE_DELAY);

  // Sync local state with prop changes
  useEffect(() => {
    if (searchInput !== localSearchInput) {
      // This will be handled by the parent component
    }
  }, [searchInput, localSearchInput]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Combine local and prop search states
  const combinedIsSearching = localIsSearching || isSearching;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={localSearchInput}
            onChange={handleInputChange}
            placeholder={`Search items by name or category... (min ${MIN_CHARACTERS} characters for auto-search)`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
          />
          {combinedIsSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          {localSearchInput.length > 0 && localSearchInput.length < MIN_CHARACTERS && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {MIN_CHARACTERS - localSearchInput.length} more
              </span>
            </div>
          )}
        </div>
        
        {showSearchButton && (
          <button 
            type="button"
            onClick={handleManualSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Search
          </button>
        )}
        
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value={10}>10 items per page</option>
          <option value={25}>25 items per page</option>
          <option value={50}>50 items per page</option>
        </select>
      </div>
      
      {/* Search status indicator */}
      {localSearchInput.length >= MIN_CHARACTERS && (
        <div className="mt-2 text-sm text-gray-600">
          {combinedIsSearching ? (
            <span className="flex items-center">
              <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full mr-2"></div>
              Searching...
            </span>
          ) : (
            <span className="text-green-600">
              ✓ Auto-search enabled (debounced by {DEBOUNCE_DELAY}ms)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoSearchForm; 