/**
 * Search items by name or category
 * @param {Array} itemsToSearch - Array of items to search
 * @param {string} searchQuery - Search query
 * @returns {Array} Filtered array of items matching the search query
 */
const searchItems = (itemsToSearch, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return itemsToSearch;
  }
  
  const normalizedSearchTerm = searchQuery.toLowerCase().trim();
  
  return itemsToSearch.filter(item => 
    item.name.toLowerCase().includes(normalizedSearchTerm) ||
    item.category.toLowerCase().includes(normalizedSearchTerm)
  );
};

module.exports = { searchItems }; 