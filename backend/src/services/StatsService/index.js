const stats = require('../../utils/Stats');

class StatsService {
  async getStats() {
    return await stats.getStats();
  }
}

module.exports = new StatsService(); 