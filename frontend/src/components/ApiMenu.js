import React, { useState } from 'react';

const ApiMenu = () => {
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
          params: [
            { name: 'searchQuery', type: 'string', description: 'Search by name or category' },
            { name: 'pageNumber', type: 'number', description: 'Page number (default: 1)' },
            { name: 'itemsPerPage', type: 'number', description: 'Items per page (default: 10)' }
          ],
          example: '/api/items?searchQuery=electronics&pageNumber=1&itemsPerPage=5',
          testUrl: `${API_BASE_URL}/api/items?searchQuery=electronics&pageNumber=1&itemsPerPage=5`
        },
        {
          method: 'GET',
          endpoint: '/api/items/:id',
          description: 'Get a specific item by ID',
          params: [
            { name: 'id', type: 'number', description: 'Item ID' }
          ],
          example: '/api/items/1',
          testUrl: `${API_BASE_URL}/api/items/1`
        },
        {
          method: 'POST',
          endpoint: '/api/items',
          description: 'Create a new item',
          body: {
            name: 'Test Item',
            category: 'Electronics',
            price: 99.99,
            description: 'A test item created via API'
          },
          example: 'POST /api/items\n{"name": "New Item", "category": "Electronics", "price": 99.99}',
          testUrl: `${API_BASE_URL}/api/items`,
          testBody: {
            name: 'Test Item',
            category: 'Electronics',
            price: 99.99,
            description: 'A test item created via API'
          }
        },
        {
          method: 'GET',
          endpoint: '/api/items/stats/strategy',
          description: 'Get data manager strategy information',
          example: '/api/items/stats/strategy',
          testUrl: `${API_BASE_URL}/api/items/stats/strategy`
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
        },
        {
          method: 'POST',
          endpoint: '/api/stats/refresh',
          description: 'Force refresh statistics cache',
          example: 'POST /api/stats/refresh',
          testUrl: `${API_BASE_URL}/api/stats/refresh`
        },
        {
          method: 'GET',
          endpoint: '/api/stats/cache-info',
          description: 'Get cache information and status',
          example: '/api/stats/cache-info',
          testUrl: `${API_BASE_URL}/api/stats/cache-info`
        }
      ]
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const testApiEndpoint = async (route, index) => {
    const routeKey = `${activeSection}-${index}`;
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

  const formatResponse = (result) => {
    if (result.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center text-red-800 mb-2">
            <span className="text-lg mr-2">❌</span>
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-red-700">{result.message}</p>
          <p className="text-red-600 text-sm mt-2">
            Timestamp: {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-green-800">
            <span className="text-lg mr-2">✅</span>
            <span className="font-semibold">Success</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              result.status >= 200 && result.status < 300 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {result.status} {result.statusText}
            </span>
            <span className="text-green-600 text-xs">
              {new Date(result.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h5 className="font-semibold text-gray-800 mb-1">Response Data:</h5>
            <pre className="bg-white border rounded p-3 text-sm overflow-x-auto max-h-64 overflow-y-auto">
              <code>{JSON.stringify(result.data, null, 2)}</code>
            </pre>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-800 mb-1">Response Headers:</h5>
            <pre className="bg-white border rounded p-3 text-sm overflow-x-auto max-h-32 overflow-y-auto">
              <code>{JSON.stringify(result.headers, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    );
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
            {apiRoutes[activeSection].routes.map((route, index) => {
              const routeKey = `${activeSection}-${index}`;
              const result = testResults[routeKey];
              const loading = isLoading[routeKey];
              const showResult = showResults[routeKey];

              return (
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => testApiEndpoint(route, index)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          loading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Testing...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            🚀 Test API
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(route.example)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          copiedEndpoint === route.example
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {copiedEndpoint === route.example ? '✅ Copied!' : '📋 Copy'}
                      </button>
                    </div>
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
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Example:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <code className="text-sm text-gray-700 whitespace-pre-wrap">
                        {route.example}
                      </code>
                    </div>
                  </div>

                  {/* Test Results */}
                  {showResult && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">Test Results:</h4>
                        <button
                          onClick={() => setShowResults(prev => ({ ...prev, [routeKey]: false }))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      {result && formatResponse(result)}
                    </div>
                  )}
                </div>
              );
            })}
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

export default ApiMenu; 