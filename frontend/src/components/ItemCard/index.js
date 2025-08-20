import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  return (
    <div className="p-4 border border-gray-200 mb-3 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      <Link 
        to={'/items/' + item.id} 
        className="text-blue-600 hover:text-blue-800 text-lg font-medium block mb-2 no-underline"
      >
        {item.name}
      </Link>
      <div className="text-gray-600 text-sm">
        Category: {item.category} | Price: ${item.price}
      </div>
    </div>
  );
};

export default ItemCard; 