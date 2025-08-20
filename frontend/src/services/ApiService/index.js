const API_BASE_URL = 'http://localhost:4001';

class ApiService {
  async fetchItems(signal, page = 1, pageSize = 10, searchQuery = '') {
    const params = new URLSearchParams({
      pageNumber: page.toString(),
      itemsPerPage: pageSize.toString()
    });
    
    if (searchQuery) {
      params.append('searchQuery', searchQuery);
    }

    const response = await fetch(`${API_BASE_URL}/api/items?${params}`, {
      signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async fetchItemById(id, signal) {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}

export default new ApiService(); 