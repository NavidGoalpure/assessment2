import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchForm from '../components/SearchForm';
import VirtualizedItemsList from '../components/VirtualizedItemsList';
import PaginationControls from '../components/PaginationControls';

const ItemsPage = () => {
  const { items, pagination, loading, searchQuery, fetchItems, setSearchQuery } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const abortController = new AbortController();

    // Fetch items with current page and search query
    fetchItems(abortController.signal, currentPage, pageSize, searchQuery).catch(error => {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchItems, currentPage, pageSize, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading && !items.length) {
    return <LoadingSpinner message="Loading items..." />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SearchForm
        searchInput={searchInput}
        onSearchInputChange={(e) => setSearchInput(e.target.value)}
        onSearchSubmit={handleSearch}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Search Results Info */}
      {searchQuery && (
        <p className="mb-6 text-gray-600">
          Search results for "{searchQuery}": {pagination.totalItems} items found
        </p>
      )}

      <VirtualizedItemsList
        items={items}
        totalItems={pagination.totalItems}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        pageSize={pageSize}
      />

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasPrevPage={pagination.hasPrevPage}
        hasNextPage={pagination.hasNextPage}
        onPageChange={handlePageChange}
      />

      {/* Loading indicator for pagination */}
      {loading && items.length > 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;