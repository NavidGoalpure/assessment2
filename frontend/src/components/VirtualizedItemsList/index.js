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

  return (
    <div className="h-96 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
      <Virtuoso
        data={items}
        itemContent={(index, item) => <ItemCard item={item} />}
        className="h-full"
        overscan={5}
        components={{
          Footer: () => (
            <div className="p-4 text-center text-gray-600 bg-white border-t border-gray-200">
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