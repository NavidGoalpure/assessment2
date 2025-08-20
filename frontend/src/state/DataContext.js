import React, { createContext, useCallback, useContext, useState } from 'react';
import apiService from '../services/apiService';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchItems = useCallback(async (signal, page = 1, limit = 10, query = '') => {
    setLoading(true);
    try {
      const data = await apiService.fetchItems(signal, page, limit, query);
      setItems(data.items);
      setPagination(data.pagination);
      setSearchQuery(query);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching items:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ 
      items, 
      pagination, 
      loading, 
      searchQuery, 
      fetchItems,
      setSearchQuery 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);