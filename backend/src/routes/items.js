const express = require('express');
const path = require('path');
const { paginateResults } = require('../utils/pagination');
const { searchItems } = require('../utils/search');
const SmartDataManager = require('../utils/dataManager');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../../data/items.json');
const dataManager = new SmartDataManager(DATA_PATH);

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const itemsData = await dataManager.getData();
    const { searchQuery, pageNumber = 1, itemsPerPage = 10 } = req.query;
    
    // Apply search filter
    let filteredItems = searchItems(itemsData, searchQuery);

    // Apply pagination
    const paginatedResponse = paginateResults(filteredItems, pageNumber, itemsPerPage);
    res.json(paginatedResponse);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const itemsData = await dataManager.getData();
    const item = itemsData.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const error = new Error('Item not found');
      error.status = 404;
      throw error;
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const newItem = req.body;
    const itemsData = await dataManager.getData();
    newItem.id = Date.now();
    itemsData.push(newItem);
    
    // Write back to file and clear cache
    const fs = require('fs').promises;
    await fs.writeFile(DATA_PATH, JSON.stringify(itemsData, null, 2));
    dataManager.clearCache(); // Clear cache after write
    
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// GET /api/items/stats/strategy (for monitoring)
router.get('/stats/strategy', (req, res) => {
  try {
    const strategyInfo = dataManager.getStrategyInfo();
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