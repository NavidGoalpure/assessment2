import React from 'react';

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleKeyDown = (event, page) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (typeof page === 'number') {
        onPageChange(page);
      }
    }
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav 
      className="flex items-center justify-between mt-6"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Page info */}
      <div className="text-sm text-gray-600">
        <span className="sr-only">Showing </span>
        {startItem}-{endItem} of {totalItems} items
        <span className="sr-only">, page {currentPage} of {totalPages}</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
          }`}
          aria-label={`Go to previous page, page ${currentPage - 1}`}
          aria-disabled={currentPage === 1}
        >
          <span aria-hidden="true">←</span>
          <span className="sr-only">Previous</span>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span 
                className="px-3 py-2 text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                onKeyDown={(e) => handleKeyDown(e, page)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                tabIndex={0}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 hover:bg-gray-100 bg-white border border-gray-300'
          }`}
          aria-label={`Go to next page, page ${currentPage + 1}`}
          aria-disabled={currentPage === totalPages}
        >
          <span aria-hidden="true">→</span>
          <span className="sr-only">Next</span>
        </button>
      </div>
    </nav>
  );
};

export default PaginationControls; 