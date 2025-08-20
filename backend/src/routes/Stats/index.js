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

module.exports = router;