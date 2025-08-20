import React from 'react';
import { Link } from 'react-router-dom';

const ItemActions = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex flex-wrap gap-4">
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          View All Items
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ItemActions; 