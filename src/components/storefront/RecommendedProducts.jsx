import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../../services/api';

const RecommendedProducts = ({ productId, title = 'You May Also Like' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      if (!productId) return;
      try {
        const res = await api.get(`/products/${productId}/recommendations`);
        if (res.data.success) {
          setRecommendations(res.data.recommendations || []);
        }
      } catch (e) {
        console.error('Failed to load recommendations', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [productId]);

  if (loading || recommendations.length === 0) return null;

  return (
    <div style={{ marginTop: '3rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{title}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Handpicked matching farm machinery and implements based on your selection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
