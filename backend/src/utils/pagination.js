/**
 * Paginate an array of results with metadata
 * @param {Array} itemsToPaginate - Array of items to paginate
 * @param {number|string} requestedPage - Current page number (default: 1)
 * @param {number|string} itemsPerPage - Items per page (default: 10)
 * @returns {Object} Object containing paginated items and pagination metadata
 */
const paginateResults = (itemsToPaginate, requestedPage = 1, itemsPerPage = 10) => {
  // Handle invalid or non-numeric values
  let currentPageNumber = parseInt(requestedPage);
  let itemsPerPageCount = parseInt(itemsPerPage);
  
  // Validate and set defaults for invalid values
  if (isNaN(currentPageNumber) || currentPageNumber < 1) {
    currentPageNumber = 1;
  }
  if (isNaN(itemsPerPageCount) || itemsPerPageCount < 1) {
    itemsPerPageCount = 10;
  }
  
  const sliceStartIndex = (currentPageNumber - 1) * itemsPerPageCount;
  const sliceEndIndex = sliceStartIndex + itemsPerPageCount;
  
  const totalItemCount = itemsToPaginate.length;
  const totalPageCount = Math.ceil(totalItemCount / itemsPerPageCount);
  
  return {
    items: itemsToPaginate.slice(sliceStartIndex, sliceEndIndex),
    pagination: {
      currentPage: currentPageNumber,
      totalPages: totalPageCount,
      totalItems: totalItemCount,
      itemsPerPage: itemsPerPageCount,
      hasNextPage: currentPageNumber < totalPageCount,
      hasPrevPage: currentPageNumber > 1
    }
  };
};

module.exports = { paginateResults }; 