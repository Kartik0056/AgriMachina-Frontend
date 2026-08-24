import React from 'react';
import { Plus, ShoppingCart, Check, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const FrequentlyBoughtTogether = ({ bundleData }) => {
  const { addMultipleToCart } = useCart();
  const { addToast } = useToast();

  if (!bundleData || !bundleData.bundle || bundleData.bundle.length === 0) return null;

  const allItems = bundleData.allProducts || [bundleData.primary, ...bundleData.bundle];

  const handleAddBundleToCart = () => {
    addMultipleToCart(allItems);
    addToast(`Added all ${allItems.length} bundle items to your cart with combo savings!`, 'success');
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #86efac',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#062416', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🌾 Frequently Bought Together</span>
          <span className="badge badge-accent" style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.75rem' }}>
            Combo Save {formatINR(bundleData.bundleSavings || 1500)}
          </span>
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
          Includes OEM Matching Guarantee
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Products Visual Strip */}
        <div className="flex items-center gap-3 flex-wrap flex-1 justify-center md:justify-start">
          {allItems.map((prod, idx) => (
            <React.Fragment key={prod._id || idx}>
              <div style={{
                width: '120px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.5rem',
                textAlign: 'center'
              }}>
                <img
                  src={prod.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=300&q=80'}
                  alt={prod.name}
                  style={{ width: '100%', height: '80px', objectFit: 'contain', marginBottom: '0.35rem' }}
                />
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2, height: '28px', overflow: 'hidden' }}>
                  {prod.name}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', marginTop: '0.2rem' }}>
                  {formatINR(prod.sellingPrice)}
                </div>
              </div>

              {idx < allItems.length - 1 && (
                <div style={{ background: '#dcfce7', padding: '0.4rem', borderRadius: '50%', color: '#166534' }}>
                  <Plus size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Total & Action */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '1.25rem',
          minWidth: '240px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Bundle Total Price:</div>
          <div className="flex items-baseline justify-center gap-2" style={{ margin: '0.25rem 0' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#062416' }}>
              {formatINR(bundleData.bundleDiscountedTotal || bundleData.bundleSellingTotal)}
            </span>
            {bundleData.bundleOriginalTotal > bundleData.bundleDiscountedTotal && (
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                {formatINR(bundleData.bundleOriginalTotal)}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, marginBottom: '0.75rem' }}>
            You save {formatINR(bundleData.bundleSavings || 0)} on this combo!
          </div>

          <button onClick={handleAddBundleToCart} className="btn btn-primary" style={{ width: '100%', padding: '0.65rem' }}>
            <ShoppingCart size={16} />
            <span>Add All {allItems.length} To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
