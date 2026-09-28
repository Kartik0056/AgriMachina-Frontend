import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2, ChevronRight, Sparkles, Clock } from 'lucide-react';
import ProductCard from './ProductCard';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const RecentlyViewed = ({
  currentProductId,
  title = 'Recently Viewed Products',
  subtitle = 'Pick up right where you left off - quick access to equipment & tools you recently browsed',
  limit = 8,
  hideWhenEmpty = false,
  containerClassName = 'container'
}) => {
  const { recentlyViewed, clearRecentlyViewed } = useCart();
  const { addToast } = useToast();

  const filtered = (recentlyViewed || []).filter(
    (p) => (p._id || p.id) !== currentProductId
  );

  const handleClear = () => {
    if (clearRecentlyViewed) {
      clearRecentlyViewed();
      if (addToast) addToast('Browsing history cleared', 'info');
    }
  };

  if (filtered.length === 0) {
    if (hideWhenEmpty) return null;

    return (
      <section className={containerClassName} style={{ marginBottom: '4.5rem' }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-color)',
            borderRadius: '20px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--bg-surface-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Recently Viewed Products
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
              You haven't viewed any machinery or tools yet. Click on any product to see your personalized browsing history here!
            </p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
            <span>Explore All Products</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={containerClassName} style={{ marginBottom: '4.5rem' }}>
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}
      >
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(22, 163, 74, 0.12)',
                color: 'var(--primary-600, #16a34a)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.6rem'
              }}
            >
              <Eye size={13} />
              <span>YOUR BROWSING HISTORY</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'} tracked
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
            title="Clear all recently viewed items"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>

          <Link
            to="/products"
            className="flex items-center gap-1"
            style={{
              color: 'var(--primary-600, #166534)',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            <span>View Catalog</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {filtered.slice(0, limit).map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
