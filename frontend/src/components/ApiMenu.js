import React, { useState } from 'react';

const ApiMenu = () => {
  const [activeSection, setActiveSection] = useState('items');
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

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
          params: [
            { name: 'searchQuery', type: 'string', description: 'Search by name or category' },
            { name: 'pageNumber', type: 'number', description: 'Page number (default: 1)' },
            { name: 'itemsPerPage', type: 'number', description: 'Items per page (default: 10)' }
          ],
          example: '/api/items?searchQuery=electronics&pageNumber=1&itemsPerPage=5'
        },
        {
          method: 'GET',
          endpoint: '/api/items/:id',
          description: 'Get a specific item by ID',
          params: [
            { name: 'id', type: 'number', description: 'Item ID' }
          ],
          example: '/api/items/1'
        },
        {
          method: 'POST',
          endpoint: '/api/items',
          description: 'Create a new item',
          body: {
            name: 'string',
            category: 'string',
            price: 'number',
            description: 'string (optional)'
          },
          example: 'POST /api/items\n{"name": "New Item", "category": "Electronics", "price": 99.99}'
        },
        {
          method: 'GET',
          endpoint: '/api/items/stats/strategy',
          description: 'Get data manager strategy information',
          example: '/api/items/stats/strategy'
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
          example: '/api/stats'
        },
        {
          method: 'POST',
          endpoint: '/api/stats/refresh',
          description: 'Force refresh statistics cache',
          example: 'POST /api/stats/refresh'
        },
        {
          method: 'GET',
          endpoint: '/api/stats/cache-info',
          description: 'Get cache information and status',
          example: '/api/stats/cache-info'
        }
      ]
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-green-100 text-green-800 border-green-200',
      POST: 'bg-blue-100 text-blue-800 border-blue-200',
      PUT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      DELETE: 'bg-red-100 text-red-800 border-red-200',
      PATCH: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[method] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 API Documentation
          </h1>
          <p className="text-gray-600 text-lg">
            Complete backend API reference with interactive examples
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            {Object.entries(apiRoutes).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>

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
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Route Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMethodColor(route.method)}`}>
                      {route.method}
                    </span>
                    <code className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono text-gray-800">
                      {route.endpoint}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(route.example)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      copiedEndpoint === route.example
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {copiedEndpoint === route.example ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4">{route.description}</p>

                {/* Parameters */}
                {route.params && route.params.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Parameters:</h4>
                    <div className="space-y-2">
                      {route.params.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-center space-x-3 text-sm">
                          <code className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono">
                            {param.name}
                          </code>
                          <span className="text-gray-500">({param.type})</span>
                          <span className="text-gray-600">- {param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {route.body && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Request Body:</h4>
                    <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                      <code>{JSON.stringify(route.body, null, 2)}</code>
                    </pre>
                  </div>
                )}

                {/* Example */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Example:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-sm text-gray-700 whitespace-pre-wrap">
                      {route.example}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            💡 Click "Copy" to copy endpoint examples to clipboard
          </p>
          <p className="text-sm mt-1">
            🔗 Base URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:4001</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiMenu; 