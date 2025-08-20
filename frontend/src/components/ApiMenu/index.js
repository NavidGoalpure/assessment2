import React, { useState } from 'react';
import ApiNavigationTabs from '../ApiNavigationTabs';
import ApiRouteCard from '../ApiRouteCard';

const ApiMenuPage = () => {
  const [activeSection, setActiveSection] = useState('items');
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [showResults, setShowResults] = useState({});

  const API_BASE_URL = 'http://localhost:4001';

  const apiRoutes = {
    items: {
      title: 'Items API',
      description: 'Manage items with CRUD operations, search, and pagination',
      icon: '📦',
      routes: [
        {
          method: 'GET',
          endpoint: '/api/items',
          description: 'Get all items with pagination and search',
          parameters: [
            { name: 'searchQuery', required: false, description: 'Search by name or category' },
            { name: 'pageNumber', required: false, description: 'Page number (default: 1)' },
            { name: 'itemsPerPage', required: false, description: 'Items per page (default: 10)' }
          ],
          example: '/api/items?searchQuery=electronics&pageNumber=1&itemsPerPage=5',
          testUrl: `${API_BASE_URL}/api/items?searchQuery=electronics&pageNumber=1&itemsPerPage=5`
        },
        {
          method: 'GET',
          endpoint: '/api/items/:id',
          description: 'Get a specific item by ID',
          parameters: [
            { name: 'id', required: true, description: 'Item ID' }
          ],
          example: '/api/items/1',
          testUrl: `${API_BASE_URL}/api/items/1`
        }
      ]
    },
    stats: {
      title: 'Statistics API',
      description: 'Get comprehensive statistics and cache management',
      icon: '📊',
      routes: [
        {
          method: 'GET',
          endpoint: '/api/stats',
          description: 'Get comprehensive statistics (cached for 5 minutes)',
          example: '/api/stats',
          testUrl: `${API_BASE_URL}/api/stats`
        }
      ]
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const testApiEndpoint = async (routeKey, route) => {
    setIsLoading(prev => ({ ...prev, [routeKey]: true }));
    setTestResults(prev => ({ ...prev, [routeKey]: null }));
    setShowResults(prev => ({ ...prev, [routeKey]: true }));

    try {
      const options = {
        method: route.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (route.method === 'POST' && route.testBody) {
        options.body = JSON.stringify(route.testBody);
      }

      const response = await fetch(route.testUrl, options);
      const data = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [routeKey]: {
          status: response.status,
          statusText: response.statusText,
          data: data,
          headers: Object.fromEntries(response.headers.entries()),
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [routeKey]: {
          error: true,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [routeKey]: false }));
    }
  };

  const toggleResults = (routeKey) => {
    setShowResults(prev => ({ ...prev, [routeKey]: !prev[routeKey] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 API Documentation & Testing
          </h1>
          <p className="text-gray-600 text-lg">
            Complete backend API reference with interactive testing
          </p>
        </div>

        <ApiNavigationTabs
          apiRoutes={apiRoutes}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* API Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-3">{apiRoutes[activeSection].icon}</span>
              {apiRoutes[activeSection].title}
            </h2>
            <p className="text-blue-100 mt-2">
              {apiRoutes[activeSection].description}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {apiRoutes[activeSection].routes.map((route, index) => (
              <ApiRouteCard
                key={index}
                route={route}
                index={index}
                activeSection={activeSection}
                copiedEndpoint={copiedEndpoint}
                testResults={testResults}
                isLoading={isLoading}
                showResults={showResults}
                onCopyEndpoint={copyToClipboard}
                onTestApi={testApiEndpoint}
                onToggleResults={toggleResults}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            💡 Click "Test API" to run endpoints and see live results
          </p>
          <p className="text-sm mt-1">
            🔗 Base URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:4001</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiMenuPage; 