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
}

module.exports = new ItemsService(); 