import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../state/DataContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ItemHeader from '../../components/ItemHeader';
import ItemInfoCard from '../../components/ItemInfoCard';
import ItemActions from '../../components/ItemActions';

const ItemDetailPage = () => {
  const { id } = useParams();
  const { fetchItem } = useData();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const itemData = await fetchItem(id, abortController.signal);
        setItem(itemData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error loading item:', error);
          setError('Failed to load item details');
        }
      } finally {
        setLoading(false);
      }
    };

    loadItem();

    return () => {
      abortController.abort();
    };
  }, [id, fetchItem]);

  if (loading) {
    return <LoadingSpinner message="Loading item details..." />;
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Item not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ItemHeader itemName={item.name} />
      <ItemInfoCard item={item} />
      <ItemActions />
    </div>
  );
};

export default ItemDetailPage;