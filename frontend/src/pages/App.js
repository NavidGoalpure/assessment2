import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ItemsPage from './Items';
import ItemDetailPage from './ItemDetail';
import ApiMenuPage from '../components/ApiMenu';
import ErrorBoundary from '../components/ErrorBoundary';
import { DataProvider } from '../state/DataContext';

const App = () => {
  return (
    <ErrorBoundary>
      <DataProvider>
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-800 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                📦 Items
              </Link>
              <Link 
                to="/api" 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                📚 API Docs
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              React + Node.js Assessment
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<ItemsPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/api" element={<ApiMenuPage />} />
        </Routes>
      </DataProvider>
    </ErrorBoundary>
  );
};

export default App;