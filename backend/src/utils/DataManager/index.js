const fs = require('fs').promises;
const path = require('path');

class DataManager {
  constructor() {
    this.dataPath = path.join(__dirname, '../../../../data/items.json');
    this.cache = null;
    this.lastLoad = 0;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
  }

  async getAllItems() {
    const now = Date.now();
      
    // Return cached data if still valid
    if (this.cache && (now - this.lastLoad) < this.cacheDuration) {
      return this.cache;
      }

    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      this.cache = JSON.parse(data);
      this.lastLoad = now;
      return this.cache;
    } catch (error) {
      console.error('Error loading items data:', error);
      throw new Error('Failed to load items data');
    }
  }

  clearCache() {
    this.cache = null;
    this.lastLoad = 0;
  }
}

module.exports = new DataManager(); 