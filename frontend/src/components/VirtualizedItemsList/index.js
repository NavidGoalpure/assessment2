import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import ItemCard from '../ItemCard';

const VirtualizedItemsList = ({ items, totalItems, currentPage, totalPages, pageSize }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No items found.</p>
      </div>
    );
  }

  // Calculate dynamic height based on number of items
  const getDynamicHeight = () => {
    const itemHeight = 80; // Approximate height of each item card
    const footerHeight = 60; // Height of the footer
    const minHeight = 200; // Minimum height
    const maxHeight = 400; // Maximum height (original fixed height)
    
    const calculatedHeight = (items.length * itemHeight) + footerHeight;
    
    // Return height within bounds
    return Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
  };

  const dynamicHeight = getDynamicHeight();

  return (
    <div 
      className="pl-4 pt-2 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
      style={{ height: `${dynamicHeight}px` }}
    >
      <Virtuoso
        data={items}
        itemContent={(index, item) => <ItemCard item={item} />}
        className="h-full"
        overscan={5}
        components={{
          Footer: () => (
            <div className="p-4 text-center text-gray-600 bg-gray-50">
              <div>
                Showing {items.length} of {totalItems} items
                {totalPages > 1 && (
                  <span> (Page {currentPage} of {totalPages})</span>
                )}
              </div>
              {pageSize > 10 && (
                <div className="text-xs mt-2 text-gray-500">
                  Using virtualization for smooth performance
                </div>
              )}
            </div>
          )
        }}
      />
    </div>
  );
};

export default VirtualizedItemsList; 