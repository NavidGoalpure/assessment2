const express = require('express');
const statsService = require('../../services/StatsService');

const router = express.Router();

// GET /api/stats - Get statistics
router.get('/', async (req, res) => {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/stats/refresh - Force refresh stats cache
router.post('/refresh', async (req, res) => {
  try {
    const stats = await statsService.refreshStats();
    res.json({
      success: true,
      message: 'Stats cache refreshed manually',
      stats
    });
  } catch (error) {
    console.error('Error refreshing stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/stats/cache-info - Get cache information
router.get('/cache-info', async (req, res) => {
  try {
    const cacheInfo = await statsService.getCacheInfo();
    res.json(cacheInfo);
  } catch (error) {
    console.error('Error fetching cache info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;