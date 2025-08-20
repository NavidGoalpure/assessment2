const dataManager = require('../../utils/DataManager');

class ItemsService {
  constructor() {
    this.dataManager = dataManager;
  }

  async getAllItems() {
    return await this.dataManager.getAllItems();
  }

  async getItemById(id) {
    const items = await this.dataManager.getAllItems();
    return items.find(item => item.id.toString() === id.toString());
  }

  async getStrategyInfo() {
    const items = await this.dataManager.getAllItems();
    const fileSize = JSON.stringify(items).length;
    
    return {
      currentStrategy: 'file-based',
      fileSize: fileSize,
      hasCache: false,
      itemCount: items.length
    };
  }
}

module.exports = new ItemsService(); 