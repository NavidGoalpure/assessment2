const SmartDataManager = require('../utils/dataManager');
const path = require('path');
const fs = require('fs').promises;

class ItemsService {
  constructor() {
    const DATA_PATH = path.join(__dirname, '../../../data/items.json');
    this.dataManager = new SmartDataManager(DATA_PATH);
    this.DATA_PATH = DATA_PATH;
  }

  /**
   * Get all items with search and pagination
   */
  async getItems(searchQuery, pageNumber = 1, itemsPerPage = 10) {
    const itemsData = await this.dataManager.getData();
    
    // Apply search filter
    const { searchItems } = require('../utils/search');
    let filteredItems = searchItems(itemsData, searchQuery);

    // Apply pagination
    const { paginateResults } = require('../utils/pagination');
    return paginateResults(filteredItems, pageNumber, itemsPerPage);
  }

  /**
   * Get a single item by ID
   */
  async getItemById(id) {
    const itemsData = await this.dataManager.getData();
    const item = itemsData.find(i => i.id === parseInt(id));
    
    if (!item) {
      const error = new Error('Item not found');
      error.status = 404;
      throw error;
    }
    
    return item;
  }

  /**
   * Create a new item
   */
  async createItem(itemData) {
    // TODO: Add validation logic here
    const itemsData = await this.dataManager.getData();
    
    const newItem = {
      ...itemData,
      id: this.generateItemId()
    };
    
    itemsData.push(newItem);
    
    // Write back to file and clear cache
    await this.saveItemsToFile(itemsData);
    this.dataManager.clearCache();
    
    return newItem;
  }

  /**
   * Generate unique item ID
   */
  generateItemId() {
    return Date.now();
  }

  /**
   * Save items data to file
   */
  async saveItemsToFile(itemsData) {
    await fs.writeFile(this.DATA_PATH, JSON.stringify(itemsData, null, 2));
  }

  /**
   * Get data manager strategy information
   */
  getStrategyInfo() {
    return this.dataManager.getStrategyInfo();
  }
}

module.exports = ItemsService; 