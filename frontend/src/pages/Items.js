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
    <div style={{ 
      padding: '10px', 
      border: '1px solid #ddd', 
      marginBottom: '10px',
      borderRadius: '4px',
      backgroundColor: 'white'
    }}>
      <Link to={'/items/' + item.id} style={{ 
        textDecoration: 'none', 
        color: '#007bff',
        fontSize: '16px',
        display: 'block',
        marginBottom: '4px'
      }}>
        {item.name}
      </Link>
      <div style={{ color: '#666', fontSize: '14px' }}>
        Category: {item.category} | Price: ${item.price}
      </div>
    </div>
  );

  if (loading && !items.length) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search items by name or category..."
          style={{ 
            padding: '8px 12px', 
            fontSize: '16px', 
            width: '300px',
            marginRight: '10px'
          }}
        />
        <button 
          type="submit"
          style={{ 
            padding: '8px 16px', 
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Search
        </button>
        
        {/* Page Size Selector */}
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white'
          }}
        >
          <option value={10}>10 items per page</option>
          <option value={25}>25 items per page</option>
          <option value={50}>50 items per page</option>
        </select>
      </form>

      {/* Search Results Info */}
      {searchQuery && (
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Search results for "{searchQuery}": {pagination.totalItems} items found
        </p>
      )}

      {/* Virtualized Items List */}
      {items.length > 0 ? (
        <div style={{ 
          height: '600px', 
          border: '1px solid #eee',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <Virtuoso
            data={items}
            itemContent={(index, item) => <ItemComponent item={item} />}
            style={{ height: '100%' }}
            overscan={5}
            components={{
              Footer: () => (
                <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                  Showing {items.length} of {pagination.totalItems} items
                  {pagination.totalPages > 1 && (
                    <span> (Page {pagination.currentPage} of {pagination.totalPages})</span>
                  )}
                  {pageSize > 10 && (
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                      Using virtualization for smooth performance
                    </div>
                  )}
                </div>
              )
            }}
          />
        </div>
      ) : (
        <p>No items found.</p>
      )}

      {/* Pagination Controls - Show when there are multiple pages */}
      {pagination.totalPages > 1 && (
        <div style={{ 
          marginTop: '20px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '10px'
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            style={{ 
              padding: '8px 12px',
              backgroundColor: pagination.hasPrevPage ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed'
            }}
          >
            Previous
          </button>
          
          <span style={{ padding: '8px 12px' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            style={{ 
              padding: '8px 12px',
              backgroundColor: pagination.hasNextPage ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && items.length > 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</p>
      )}
    </div>
  );
}

export default Items;