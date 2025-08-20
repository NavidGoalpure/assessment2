import React from 'react';
import ApiResponseFormatter from './ApiResponseFormatter';

const ApiRouteCard = ({ 
  route, 
  index, 
  activeSection, 
  copiedEndpoint, 
  testResults, 
  isLoading, 
  showResults,
  onCopyEndpoint,
  onTestApi,
  onToggleResults
}) => {
  const routeKey = `${activeSection}-${index}`;
  const result = testResults[routeKey];
  const loading = isLoading[routeKey];
  const showResult = showResults[routeKey];

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
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
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
            onClick={() => onTestApi(route, index)}
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
            onClick={() => onCopyEndpoint(route.example)}
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
              onClick={() => onToggleResults(routeKey)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {result && <ApiResponseFormatter result={result} />}
        </div>
      )}
    </div>
  );
};

export default ApiRouteCard; 