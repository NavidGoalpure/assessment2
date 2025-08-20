import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import ApiMenu from '../components/ApiMenu';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
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
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/api" element={<ApiMenu />} />
      </Routes>
    </DataProvider>
  );
}

export default App;