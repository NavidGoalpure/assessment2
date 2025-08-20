import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ItemHeader from '../components/ItemHeader';
import ItemInfoCard from '../components/ItemInfoCard';
import ItemActions from '../components/ItemActions';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiService.fetchItemById(id)
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/');
      });
  }, [id, navigate]);

  if (loading) {
    return <LoadingSpinner message="Loading item details..." />;
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Item not found.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to Items
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ItemHeader itemName={item.name} />
      <ItemInfoCard item={item} />
      <ItemActions />
    </div>
  );
};

export default ItemDetailPage;