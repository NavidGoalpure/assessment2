import React from 'react';

const ApiNavigationTabs = ({ apiRoutes, activeSection, onSectionChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-xl p-1 shadow-lg">
        {Object.entries(apiRoutes).map(([key, section]) => (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
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
  );
};

export default ApiNavigationTabs; 