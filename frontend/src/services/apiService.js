const API_BASE_URL = 'http://localhost:4001/api';

class ApiService {
  /**
   * Fetch items with search and pagination
   */
  async fetchItems(signal, page = 1, limit = 10, query = '') {
    const params = new URLSearchParams({
      pageNumber: page.toString(),
      itemsPerPage: limit.toString()
    });
    
    if (query) {
      params.append('searchQuery', query);
    }

    const response = await fetch(`${API_BASE_URL}/items?${params}`, { 
      signal: signal || undefined 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Fetch a single item by ID
   */
  async fetchItemById(id, signal) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, { 
      signal: signal || undefined 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Create a new item
   */
  async createItem(itemData, signal) {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
      signal: signal || undefined
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Fetch stats
   */
  async fetchStats(signal) {
    const response = await fetch(`${API_BASE_URL}/stats`, { 
      signal: signal || undefined 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

export default new ApiService(); 