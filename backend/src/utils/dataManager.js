const fs = require('fs').promises;
const path = require('path');

class SmartDataManager {
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.cachedData = null;
    this.lastCacheRefresh = 0;
    this.fileStats = null;
    this.currentStrategy = null;
    this.statsCacheDuration = 60000; // 1 minute for file stats cache
  }

  /**
   * Main method to get data with automatic strategy selection
   */
  async getData() {
    try {
      // Update file statistics
      await this.updateFileStats();
      
      // Choose optimal strategy based on file size
      const selectedStrategy = this.chooseStrategy();
      
      // Execute the chosen strategy
      return await this.executeStrategy(selectedStrategy);
    } catch (error) {
      console.error('Error in SmartDataManager.getData():', error);
      throw error;
    }
  }

  /**
   * Update file statistics with caching
   */
  async updateFileStats() {
    const currentTimestamp = Date.now();
    
    // Only update stats if cache is expired or doesn't exist
    if (!this.fileStats || (currentTimestamp - this.fileStats.timestamp) > this.statsCacheDuration) {
      try {
        const fileStats = await fs.stat(this.dataPath);
        this.fileStats = {
          size: fileStats.size,
          modificationTime: fileStats.mtime,
          timestamp: currentTimestamp
        };
      } catch (fileError) {
        console.error('Error getting file stats:', fileError);
        throw fileError;
      }
    }
  }

  /**
   * Choose the optimal strategy based on file size
   */
  chooseStrategy() {
    const fileSizeInBytes = this.fileStats.size;
    
    if (fileSizeInBytes < 100 * 1024) { // < 100KB
      return {
        type: 'cache',
        duration: 5 * 60 * 1000, // 5 minutes
        name: 'small-file-cache',
        description: 'Small file optimized with short-term caching'
      };
    } else if (fileSizeInBytes < 1024 * 1024) { // < 1MB
      return {
        type: 'cache',
        duration: 30 * 60 * 1000, // 30 minutes
        name: 'medium-file-cache',
        description: 'Medium file with extended caching'
      };
    } else { // >= 1MB
      return {
        type: 'direct',
        name: 'large-file-direct',
        description: 'Large file with direct read (no caching)'
      };
    }
  }

  /**
   * Execute the chosen strategy
   */
  async executeStrategy(selectedStrategy) {
    this.currentStrategy = selectedStrategy.name;
    
    try {
      if (selectedStrategy.type === 'cache') {
        return await this.readWithCaching(selectedStrategy.duration);
      } else {
        return await this.readWithPromise();
      }
    } catch (error) {
      console.error(`Error executing strategy ${selectedStrategy.name}:`, error);
      throw error;
    }
  }

  /**
   * Read data with caching strategy
   */
  async readWithCaching(cacheDuration) {
    const currentTimestamp = Date.now();
    
    // Check if cache is valid
    if (this.cachedData && (currentTimestamp - this.lastCacheRefresh) < cacheDuration) {
      return this.cachedData;
    }
    
    // Cache miss or expired - read from file
    try {
      const fileContent = await fs.readFile(this.dataPath, 'utf8');
      this.cachedData = JSON.parse(fileContent);
      this.lastCacheRefresh = currentTimestamp;
      
      console.log(`Cache refreshed for strategy: ${this.currentStrategy}`);
      return this.cachedData;
    } catch (error) {
      // If we have stale cache, use it as fallback
      if (this.cachedData) {
        console.warn('Using stale cache due to file read error:', error.message);
        return this.cachedData;
      }
      throw error;
    }
  }

  /**
   * Read data directly without caching
   */
  async readWithPromise() {
    try {
      const fileContent = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading file directly:', error);
      throw error;
    }
  }

  /**
   * Get current strategy information
   */
  getStrategyInfo() {
    return {
      currentStrategy: this.currentStrategy,
      fileSize: this.fileStats?.size || null,
      lastRefresh: this.lastCacheRefresh,
      hasCache: !!this.cachedData,
      cacheAge: this.lastCacheRefresh ? Date.now() - this.lastCacheRefresh : null
    };
  }

  /**
   * Clear cache manually (useful for testing or manual refresh)
   */
  clearCache() {
    this.cachedData = null;
    this.lastCacheRefresh = 0;
    this.fileStats = null;
    console.log('Cache cleared manually');
  }
}

module.exports = SmartDataManager; 