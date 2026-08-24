import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
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
    addToast(`Added all ${allItems.length} bundle items to your cart with combo savings! 🚜`, 'success');
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1.5px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <span>🌾 Frequently Bought Together</span>
          </h3>
          <span
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              fontSize: '0.725rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              letterSpacing: '0.02em',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
            }}
          >
            COMBO SAVE {formatINR(bundleData.bundleSavings || 1500)}
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--primary-600, #166534)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={16} />
          <span>Includes OEM Matching Guarantee</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Clickable Products Visual Strip */}
        <div className="flex items-center gap-3 flex-wrap flex-1 justify-center lg:justify-start">
          {allItems.map((prod, idx) => {
            const productTargetUrl = `/product/${prod.slug || prod._id}`;

            return (
              <React.Fragment key={prod._id || idx}>
                <Link
                  to={productTargetUrl}
                  title={`View details for ${prod.name}`}
                  style={{
                    width: '125px',
                    background: 'var(--bg-surface-alt)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.5rem',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  className="group hover:scale-105 hover:shadow-md"
                >
                  {/* Thumbnail Container */}
                  <div
                    style={{
                      width: '100%',
                      height: '84px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      marginBottom: '0.5rem',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={prod.mainImage?.url || '/images/machinery/power_weeder.jpg'}
                      alt={prod.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.2s ease'
                      }}
                      className="group-hover:scale-108"
                    />
                  </div>

                  {/* Product Title */}
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      lineHeight: 1.25,
                      height: '30px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: '0.25rem',
                      transition: 'color 0.15s ease'
                    }}
                    className="group-hover:text-primary-600"
                  >
                    {prod.name}
                  </div>

                  {/* Price */}
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-600, #166534)' }}>
                    {formatINR(prod.sellingPrice)}
                  </div>

                  {/* Subtle View Indicator */}
                  <div
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      marginTop: '0.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <span>View</span>
                    <ExternalLink size={10} />
                  </div>
                </Link>

                {idx < allItems.length - 1 && (
                  <div
                    style={{
                      background: 'var(--bg-surface-alt)',
                      border: '1px solid var(--border-color)',
                      padding: '0.45rem',
                      borderRadius: '50%',
                      color: 'var(--primary-600, #166534)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Total & Action Box */}
        <div
          style={{
            background: 'var(--bg-surface-alt)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.25rem',
            minWidth: '250px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)' }}>Bundle Total Price:</div>
          <div className="flex items-baseline justify-center gap-2" style={{ margin: '0.35rem 0' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>
              {formatINR(bundleData.bundleDiscountedTotal || bundleData.bundleSellingTotal)}
            </span>
            {bundleData.bundleOriginalTotal > bundleData.bundleDiscountedTotal && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatINR(bundleData.bundleOriginalTotal)}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--primary-600, #166534)', fontWeight: 800, marginBottom: '0.85rem' }}>
            You save {formatINR(bundleData.bundleSavings || 0)} on this combo!
          </div>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              background: 'var(--primary-600, #166534)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)',
              transition: 'all 0.2s ease'
            }}
            className="hover:scale-102 active:scale-98 hover:brightness-110"
          >
            <ShoppingCart size={16} />
            <span>Add All {allItems.length} To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
