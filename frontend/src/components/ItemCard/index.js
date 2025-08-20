import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  // Format price with proper currency display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Get category color based on category name
  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'bg-blue-100 text-blue-800',
      'Furniture': 'bg-amber-100 text-amber-800',
      'Appliances': 'bg-green-100 text-green-800',
      'Office Supplies': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Get category emoji
  const getCategoryEmoji = (category) => {
    const emojis = {
      'Electronics': '📱',
      'Furniture': '🪑',
      'Appliances': '🏠',
      'Office Supplies': '📎'
    };
    return emojis[category] || '📦';
  };

  return (
    <Link to={'/items/' + item.id} className="block">
      <div className="mb-2 group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 p-3">
        <div className="flex items-center space-x-3">
          {/* Category emoji and badge */}
          <div className="flex flex-col items-center space-y-1 min-w-0">
            <span className="text-lg">{getCategoryEmoji(item.category)}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
              {item.category}
            </span>
          </div>

          {/* Product information */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                {item.description}
              </p>
            )}
            {item.rating && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 text-xs mr-1">⭐</span>
                <span className="text-xs text-gray-600">{item.rating}</span>
              </div>
            )}
          </div>

          {/* Price display */}
          <div className="text-right min-w-0">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
              <div className="text-sm font-bold">
                {formatPrice(item.price)}
              </div>
            </div>
            {item.price > 1000 && (
              <div className="text-xs text-gray-500 mt-1">Premium</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard; 