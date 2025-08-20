/**
 * Paginate an array of results with metadata
 * @param {Array} results - Array of items to paginate
 * @param {number|string} page - Current page number (default: 1)
 * @param {number|string} limit - Items per page (default: 10)
 * @returns {Object} Object containing paginated items and pagination metadata
 */
const paginateResults = (results, page = 1, limit = 10) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / limitNum);
  
  return {
    items: results.slice(startIndex, endIndex),
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalItems,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  };
};

module.exports = { paginateResults }; 