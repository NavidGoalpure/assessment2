/**
 * Search items by name or category
 * @param {Array} items - Array of items to search
 * @param {string} query - Search query
 * @returns {Array} Filtered array of items matching the search query
 */
const searchItems = (items, query) => {
  if (!query || query.trim() === '') {
    return items;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return items.filter(item => 
    item.name.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );
};

module.exports = { searchItems }; 