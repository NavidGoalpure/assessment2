const express = require('express');
const StatsService = require('../services/statsService');
const router = express.Router();

// Create a single instance of StatsService
const statsService = new StatsService();

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// POST /api/stats/refresh (for manual cache refresh)
router.post('/refresh', async (req, res, next) => {
  try {
    const result = await statsService.refreshStats();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/stats/cache-info (for monitoring)
router.get('/cache-info', (req, res) => {
  try {
    const cacheInfo = statsService.getCacheInfo();
    res.json(cacheInfo);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;