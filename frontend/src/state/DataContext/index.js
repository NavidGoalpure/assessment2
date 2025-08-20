import React, { createContext, useContext, useReducer, useCallback } from 'react';
import apiService from '../../services/ApiService';

// Initial state
const initialState = {
  items: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: false,
  searchQuery: ''
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ITEMS: 'SET_ITEMS',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const dataReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ITEMS:
      return { 
        ...state, 
        items: action.payload.items, 
        pagination: action.payload.pagination,
        loading: false 
      };
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, loading: false };
    default:
      return state;
  }
};

// Create context
const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const fetchItems = useCallback(async (signal, page = 1, pageSize = 10, searchQuery = '') => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const response = await apiService.fetchItems(signal, page, pageSize, searchQuery);
      
      dispatch({ 
        type: ACTIONS.SET_ITEMS, 
        payload: response 
      });
    } catch (error) {
        console.error('Error fetching items:', error);
      dispatch({ type: ACTIONS.SET_ERROR });
      }
  }, []);

  const fetchItem = useCallback(async (id, signal) => {
    try {
      const response = await apiService.fetchItemById(id, signal);
      return response;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query });
  }, []);

  const value = {
    ...state,
    fetchItems,
    fetchItem,
    setSearchQuery
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};