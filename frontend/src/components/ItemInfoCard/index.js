import React from 'react';

const ItemInfoCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-blue-100 mt-2">Item Details</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="text-gray-800">{item.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Category:</span>
                <span className="text-gray-800">{item.category}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Price:</span>
                <span className="text-green-600 font-bold text-lg">${item.price}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">ID:</span>
                <span className="text-gray-500 font-mono">{item.id}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Details</h3>
            <div className="space-y-3">
              {item.description && (
                <div>
                  <span className="text-gray-600 font-medium block mb-2">Description:</span>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {item.description}
                  </p>
                </div>
              )}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📦 Item Information</h4>
                <p className="text-blue-700 text-sm">
                  This item is part of the {item.category} category and is available for purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemInfoCard; 