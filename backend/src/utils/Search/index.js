/**
 * Filter items by search query
 * @param {Array} items - Array of items to search
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered items
 */
function filterItems(items, searchQuery) {
  if (!searchQuery || searchQuery.trim() === '') {
    return items;
  }
  
  const query = searchQuery.toLowerCase().trim();
  
  return items.filter(item => {
    const name = (item.name || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    
    return name.includes(query) || 
           category.includes(query) || 
           description.includes(query);
  });
}

module.exports = {
  filterItems
}; 