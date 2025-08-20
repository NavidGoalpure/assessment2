import React from 'react';

const SearchForm = ({ 
  searchInput, 
  onSearchInputChange, 
  onSearchSubmit, 
  pageSize, 
  onPageSizeChange 
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={searchInput}
          onChange={onSearchInputChange}
          placeholder="Search items by name or category..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Search
        </button>
        
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
    </form>
  );
};

export default SearchForm; 