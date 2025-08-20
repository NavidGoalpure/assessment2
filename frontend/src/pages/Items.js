import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
    const abortController = new AbortController();

    // Fix: Use AbortController to cancel fetch when component unmounts
    fetchItems(abortController.signal).catch(error => {
      // Only log error if it's not an abort error
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });

    // Cleanup to avoid memory leak
    return () => {
      abortController.abort();
    };
  }, [fetchItems]);

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={'/items/' + item.id}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;