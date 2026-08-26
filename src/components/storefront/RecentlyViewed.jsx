import React from 'react';
import ProductCard from './ProductCard';
import { useCart } from '../../context/CartContext';

const RecentlyViewed = ({ currentProductId }) => {
  const { recentlyViewed } = useCart();

  const filtered = (recentlyViewed || []).filter((p) => p._id !== currentProductId);

  if (filtered.length === 0) return null;

  return (
    <div style={{ marginTop: '3.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>Recently Viewed Farm Equipment</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
