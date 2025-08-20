import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './state/DataContext';
import ItemsPage from './pages/Items';
import ItemDetailPage from './pages/ItemDetail';
import ApiMenuPage from './components/ApiMenu';
import './index.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          {/* Skip link for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
          >
            Skip to main content
          </a>
          
          <main id="main-content" role="main">
            <Routes>
              <Route path="/" element={<ItemsPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route path="/api" element={<ApiMenuPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App; 