const { paginateResults } = require('./pagination');

// Simple test to demonstrate the utility
function testPagination() {
  const testData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' },
    { id: 9, name: 'Item 9' },
    { id: 10, name: 'Item 10' },
    { id: 11, name: 'Item 11' }
  ];

  console.log('Testing pagination utility...\n');

  // Test page 1 with 5 items per page
  const page1 = paginateResults(testData, 1, 5);
  console.log('Page 1 (5 items per page):');
  console.log(`Items: ${page1.items.length}`);
  console.log(`Current Page: ${page1.pagination.currentPage}`);
  console.log(`Total Pages: ${page1.pagination.totalPages}`);
  console.log(`Total Items: ${page1.pagination.totalItems}`);
  console.log(`Has Next: ${page1.pagination.hasNextPage}`);
  console.log(`Has Prev: ${page1.pagination.hasPrevPage}\n`);

  // Test page 2 with 5 items per page
  const page2 = paginateResults(testData, 2, 5);
  console.log('Page 2 (5 items per page):');
  console.log(`Items: ${page2.items.length}`);
  console.log(`Current Page: ${page2.pagination.currentPage}`);
  console.log(`Total Pages: ${page2.pagination.totalPages}`);
  console.log(`Total Items: ${page2.pagination.totalItems}`);
  console.log(`Has Next: ${page2.pagination.hasNextPage}`);
  console.log(`Has Prev: ${page2.pagination.hasPrevPage}\n`);

  // Test page 3 with 5 items per page
  const page3 = paginateResults(testData, 3, 5);
  console.log('Page 3 (5 items per page):');
  console.log(`Items: ${page3.items.length}`);
  console.log(`Current Page: ${page3.pagination.currentPage}`);
  console.log(`Total Pages: ${page3.pagination.totalPages}`);
  console.log(`Total Items: ${page3.pagination.totalItems}`);
  console.log(`Has Next: ${page3.pagination.hasNextPage}`);
  console.log(`Has Prev: ${page3.pagination.hasPrevPage}`);
}

// Run test if this file is executed directly
if (require.main === module) {
  testPagination();
}

module.exports = { testPagination }; 