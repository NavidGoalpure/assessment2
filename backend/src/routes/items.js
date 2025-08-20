const express = require('express');
const ItemsService = require('../services/itemsService');
const router = express.Router();

// Create a single instance of ItemsService
const itemsService = new ItemsService();

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const { searchQuery, pageNumber = 1, itemsPerPage = 10 } = req.query;
    const result = await itemsService.getItems(searchQuery, pageNumber, itemsPerPage);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await itemsService.getItemById(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const newItem = await itemsService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/stats/strategy (for monitoring)
router.get('/stats/strategy', (req, res) => {
  try {
    const strategyInfo = itemsService.getStrategyInfo();
    res.json({
      success: true,
      data: strategyInfo,
      message: 'Current data manager strategy information'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;