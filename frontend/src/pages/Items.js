import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';

function Items() {
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

  // Virtualized item component
  const ItemComponent = ({ item }) => (
    <div className="p-4 border border-gray-200 mb-3 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      <Link 
        to={'/items/' + item.id} 
        className="text-blue-600 hover:text-blue-800 text-lg font-medium block mb-2 no-underline"
      >
        {item.name}
      </Link>
      <div className="text-gray-600 text-sm">
        Category: {item.category} | Price: ${item.price}
      </div>
    </div>
  );

  if (loading && !items.length) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search items by name or category..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Search
          </button>
          
          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value={10}>10 items per page</option>
            <option value={25}>25 items per page</option>
            <option value={50}>50 items per page</option>
          </select>
        </div>
      </form>

      {/* Search Results Info */}
      {searchQuery && (
        <p className="mb-6 text-gray-600">
          Search results for "{searchQuery}": {pagination.totalItems} items found
        </p>
      )}

      {/* Virtualized Items List */}
      {items.length > 0 ? (
        <div className="h-96 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
          <Virtuoso
            data={items}
            itemContent={(index, item) => <ItemComponent item={item} />}
            className="h-full"
            overscan={5}
            components={{
              Footer: () => (
                <div className="p-4 text-center text-gray-600 bg-white border-t border-gray-200">
                  <div>
                    Showing {items.length} of {pagination.totalItems} items
                    {pagination.totalPages > 1 && (
                      <span> (Page {pagination.currentPage} of {pagination.totalPages})</span>
                    )}
                  </div>
                  {pageSize > 10 && (
                    <div className="text-xs mt-2 text-gray-500">
                      Using virtualization for smooth performance
                    </div>
                  )}
                </div>
              )
            }}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No items found.</p>
        </div>
      )}

      {/* Pagination Controls - Show when there are multiple pages */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              pagination.hasPrevPage 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              pagination.hasNextPage 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && items.length > 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}
    </div>
  );
}

export default Items;