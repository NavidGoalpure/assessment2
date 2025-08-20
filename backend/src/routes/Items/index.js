const express = require('express');
const itemsService = require('../../services/ItemsService');
const pagination = require('../../utils/Pagination');
const search = require('../../utils/Search');

const router = express.Router();

// GET /api/items - Get all items with pagination and search
router.get('/', async (req, res) => {
  try {
    const { pageNumber = 1, itemsPerPage = 10, searchQuery = '' } = req.query;
    
    // Validate parameters
    const page = parseInt(pageNumber);
    const limit = parseInt(itemsPerPage);
    
    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ 
        error: 'Invalid pagination parameters. pageNumber and itemsPerPage must be positive integers.' 
      });
    }

    // Get all items
    const allItems = await itemsService.getAllItems();
    
    // Apply search filter if provided
    const filteredItems = searchQuery 
      ? search.filterItems(allItems, searchQuery)
      : allItems;
    
    // Apply pagination
    const paginatedResult = pagination.paginateItems(filteredItems, page, limit);
    
    res.json(paginatedResult);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/items/:id - Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await itemsService.getItemById(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;