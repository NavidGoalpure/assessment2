import React from 'react';

const ApiResponseFormatter = ({ result }) => {
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

export default ApiResponseFormatter; 