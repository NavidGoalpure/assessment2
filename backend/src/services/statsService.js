const SmartDataManager = require('../utils/dataManager');
const path = require('path');

class StatsService {
  constructor() {
    const DATA_PATH = path.join(__dirname, '../../../data/items.json');
    this.dataManager = new SmartDataManager(DATA_PATH);
    
    // Cache configuration
    this.statsCache = null;
    this.statsLastCalculated = 0;
    this.STATS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Calculate comprehensive statistics from items data
   */
  calculateStats(items) {
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
      averagePrice: Math.round(averagePrice * 100) / 100, // Round to 2 decimal places
      categories,
      priceRange,
      lastCalculated: new Date().toISOString()
    };
  }

  /**
   * Get cached stats or calculate new ones
   */
  async getStats() {
    const now = Date.now();
    
    // Return cached stats if still valid
    if (this.statsCache && (now - this.statsLastCalculated) < this.STATS_CACHE_DURATION) {
      return this.statsCache;
    }

    // Calculate new stats
    const items = await this.dataManager.getData();
    const newStats = this.calculateStats(items);
    
    // Update cache
    this.statsCache = newStats;
    this.statsLastCalculated = now;
    
    console.log('Stats cache refreshed');
    return newStats;
  }

  /**
   * Force refresh the stats cache
   */
  async refreshStats() {
    this.statsCache = null;
    this.statsLastCalculated = 0;
    
    const stats = await this.getStats();
    return {
      success: true,
      message: 'Stats cache refreshed manually',
      stats
    };
  }

  /**
   * Get cache information for monitoring
   */
  getCacheInfo() {
    const now = Date.now();
    const cacheAge = this.statsLastCalculated ? now - this.statsLastCalculated : null;
    const isExpired = this.statsCache && cacheAge && cacheAge > this.STATS_CACHE_DURATION;
    
    return {
      hasCache: !!this.statsCache,
      cacheAge: cacheAge ? Math.round(cacheAge / 1000) : null, // in seconds
      isExpired: isExpired || false,
      cacheDuration: Math.round(this.STATS_CACHE_DURATION / 1000), // in seconds
      lastCalculated: this.statsLastCalculated ? new Date(this.statsLastCalculated).toISOString() : null
    };
  }

  /**
   * Clear cache manually (useful for testing)
   */
  clearCache() {
    this.statsCache = null;
    this.statsLastCalculated = 0;
    console.log('Stats cache cleared manually');
  }
}

module.exports = StatsService; 