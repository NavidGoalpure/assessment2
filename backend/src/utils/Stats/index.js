const dataManager = require('../DataManager');

/**
 * Calculate statistics from items data
 * @param {Array} items - Array of items
 * @returns {Object} Statistics object
 */
function calculateStats(items) {
  if (!items || items.length === 0) {
    return {
      total: 0,
      averagePrice: 0,
      categories: {},
      priceRange: { min: 0, max: 0 }
    };
  }

  const total = items.length;
  const totalPrice = items.reduce((acc, item) => acc + (item.price || 0), 0);
  const averagePrice = totalPrice / total;

  // Calculate category distribution
  const categories = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Calculate price range
  const prices = items.map(item => item.price || 0).filter(price => price > 0);
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0
  };

  return {
    total,
    averagePrice: Math.round(averagePrice * 100) / 100,
    categories,
    priceRange,
    lastCalculated: new Date().toISOString()
  };
}

/**
 * Get statistics
 * @returns {Object} Statistics object
 */
async function getStats() {
  const items = await dataManager.getAllItems();
  return calculateStats(items);
}

module.exports = {
  calculateStats,
  getStats
};