import React from 'react';

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  hasPrevPage, 
  hasNextPage, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center items-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          hasPrevPage 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Previous
      </button>
      
      <span className="px-4 py-2 text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
          hasNextPage 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls; 