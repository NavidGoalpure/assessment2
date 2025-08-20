const stats = require('../../utils/Stats');

class StatsService {
  constructor() {
    this.cache = null;
    this.lastCalculated = null;
    this.cacheDuration = 300; // 5 minutes in seconds
  }

  async getStats() {
    // Check if cache is valid
    if (this.cache && this.lastCalculated) {
      const now = new Date();
      const cacheAge = (now - this.lastCalculated) / 1000; // in seconds
      
      if (cacheAge < this.cacheDuration) {
        return this.cache;
      }
    }

    // Cache expired or doesn't exist, calculate fresh stats
    return await this.refreshStats();
  }

  async refreshStats() {
    const freshStats = await stats.getStats();
    this.cache = freshStats;
    this.lastCalculated = new Date();
    return freshStats;
  }

  getCacheInfo() {
    const now = new Date();
    const cacheAge = this.lastCalculated 
      ? (now - this.lastCalculated) / 1000 
      : null;
    
    const isExpired = cacheAge !== null && cacheAge >= this.cacheDuration;

    return {
      hasCache: this.cache !== null,
      cacheAge: cacheAge,
      isExpired: isExpired,
      cacheDuration: this.cacheDuration,
      lastCalculated: this.lastCalculated ? this.lastCalculated.toISOString() : null
    };
  }
}

module.exports = new StatsService(); 