import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, ShieldCheck, CreditCard, Tractor, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id || product.id);
    addToast(`${product.name} moved to Cart!`, 'success');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem 1.25rem' }}>
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            ❤️ Kisan Saved Machinery
          </span>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: 900 }}>
            My Wishlist ({wishlistItems.length})
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Equipment you've saved to compare, check subsidy eligibility, or purchase later.
          </p>
        </div>

        {wishlistItems.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all items from your wishlist?')) clearWishlist();
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
          >
            <Trash2 size={14} />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fef2f2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Heart size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Your Wishlist is Empty
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Tap the heart icon ❤️ on any power weeder, solar pump, or harvester to save it here for easy access.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Machinery Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const prodId = product._id || product.id;
            const prodSlug = product.slug || prodId;
            const minEmi = product.emi?.minMonthlyEmi || Math.round(product.sellingPrice / 36);

            return (
              <div
                key={prodId}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(prodId)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ef4444',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    zIndex: 2
                  }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>

                <div>
                  {/* Thumbnail */}
                  <Link to={`/product/${prodSlug}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-surface-alt)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={product.mainImage?.url || '/images/machinery/power_weeder.jpg'}
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        className="hover:scale-105 transition-transform"
                      />
                    </div>

                    <div style={{ fontSize: '0.725rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {product.category || 'Agricultural Equipment'}
                    </div>

                    <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.3, marginBottom: '0.5rem' }}>
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {formatINR(product.sellingPrice)}
                    </span>
                    {product.mrp > product.sellingPrice && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                        {formatINR(product.mrp)}
                      </span>
                    )}
                  </div>

                  {minEmi > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CreditCard size={13} />
                      <span>EMI from {formatINR(minEmi)}/mo (0% Interest)</span>
                    </div>
                  )}
                </div>

                {/* Move to Cart CTA */}
                <button
                  type="button"
                  onClick={() => handleMoveToCart(product)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ShoppingCart size={15} />
                  <span>Move to Cart</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
