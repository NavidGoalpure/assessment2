import React from 'react';
import ApiResponseFormatter from '../ApiResponseFormatter';

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
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMethodColor(route.method)}`}>
            {route.method}
          </span>
          <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
            {route.endpoint}
          </code>
        </div>
          <button
          onClick={() => onCopyEndpoint(route.endpoint)}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          title="Copy endpoint"
        >
          📋
          </button>
      </div>

      <p className="text-gray-700 mb-4">{route.description}</p>

      {route.parameters && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Parameters:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {route.parameters.map((param, idx) => (
              <li key={idx}>
                <code className="bg-gray-100 px-1 rounded">{param.name}</code>
                {param.required && <span className="text-red-500 ml-1">*</span>}
                : {param.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {route.example && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Example:</h4>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
            <code>{route.example}</code>
          </pre>
        </div>
      )}

      <div className="flex items-center space-x-3">
        <button
          onClick={() => onTestApi(routeKey, route)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        
        {result && (
            <button
              onClick={() => onToggleResults(routeKey)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
            >
            {showResult ? 'Hide Results' : 'Show Results'}
            </button>
        )}
          </div>

      {showResult && result && (
        <div className="mt-4">
          <ApiResponseFormatter result={result} />
        </div>
      )}
    </div>
  );
};

export default ApiRouteCard; 