import React from 'react';
import { Link } from 'react-router-dom';

const ItemHeader = ({ itemName }) => {
  return (
    <div className="mb-6">
      <Link 
        to="/" 
        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
      >
        ← Back to Items
      </Link>
    </div>
  );
};

export default ItemHeader; 