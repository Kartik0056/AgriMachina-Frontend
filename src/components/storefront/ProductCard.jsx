import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, CreditCard, Heart, Share2, Sparkles, Check } from 'lucide-react';
import StarRating from '../common/StarRating';
import ShareProductModal from './ShareProductModal';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ product }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, trackRecentlyViewed } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const { t, tr } = useLanguage();

  const isFavorited = isInWishlist(product._id || product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQuantity <= 0) {
      addToast('Sorry, this item is currently out of stock.', 'warning');
      return;
    }
    setIsAdding(true);
    addToCart(product, 1);
    addToast(`Added ${product.name} to your cart!`, 'success');
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const isLowStock = product.stockStatus === 'LOW STOCK';
  const isOutOfStock = product.stockStatus === 'OUT OF STOCK' || product.stockQuantity <= 0;

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const minVarPrice = hasVariants
    ? Math.min(...product.variants.map((v) => Number(v.sellingPrice) || product.sellingPrice))
    : product.sellingPrice;
  const displayPrice = hasVariants ? minVarPrice : product.sellingPrice;
  const discountPercent = product.mrp > displayPrice ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100) : 0;

  return (
    <div
      className="luxury-product-card skeuo-card skeuo-card-interactive group"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Left Badges */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          pointerEvents: 'none'
        }}
      >
        {product.isDealOfTheDay && (
          <span
            style={{
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.62rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
            }}
          >
            🔥 {product.dealBadge || 'HOT DEAL'}
          </span>
        )}

        {discountPercent > 0 && !product.isDealOfTheDay && (
          <span
            style={{
              background: 'linear-gradient(135deg, #166534, #15803d)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.62rem',
              letterSpacing: '0.04em',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)'
            }}
          >
            {discountPercent}% OFF
          </span>
        )}

        {isOutOfStock ? (
          <span
            style={{
              background: '#475569',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '0.18rem 0.45rem',
              borderRadius: '6px'
            }}
          >
            {t('out_of_stock', 'Sold Out')}
          </span>
        ) : isLowStock ? (
          <span
            style={{
              background: '#fef3c7',
              color: '#b45309',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '0.18rem 0.45rem',
              borderRadius: '6px',
              border: '1px solid #fde68a'
            }}
          >
            ⚡ {t('low_stock', 'Only Few Left')}
          </span>
        ) : null}
      </div>

      {/* Top Right Floating Action Buttons */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <button
          type="button"
          onClick={handleWishlistToggle}
          style={{
            background: isFavorited ? '#fee2e2' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: isFavorited ? '1px solid #f87171' : '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.2s ease'
          }}
          className="hover:scale-110 active:scale-95"
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={15}
            color={isFavorited ? '#dc2626' : '#64748b'}
            fill={isFavorited ? '#dc2626' : 'none'}
          />
        </button>

        <button
          type="button"
          onClick={handleShareClick}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            color: '#166534',
            transition: 'all 0.2s ease'
          }}
          className="hover:scale-110 active:scale-95"
          title="Share Product"
        >
          <Share2 size={13} color="#166534" />
        </button>
      </div>

      {/* Image Container with Subtle Hover Zoom */}
      <Link
        to={`/product/${product.slug || product._id}`}
        onClick={() => trackRecentlyViewed && trackRecentlyViewed(product)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '220px',
          background: 'linear-gradient(180deg, var(--bg-surface-alt, #f8fafc) 0%, var(--bg-surface, #ffffff) 100%)',
          overflow: 'hidden',
          position: 'relative',
          padding: '1.25rem'
        }}
      >
        <img
          src={product.mainImage?.url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80'}
          alt={product.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.06))'
          }}
          className="group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Details Container */}
      <div style={{ padding: '1rem 1.15rem 1.15rem 1.15rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.65rem' }}>
        <div>
          {/* Eyebrow Brand / Category */}
          <div className="flex items-center justify-between" style={{ marginBottom: '0.3rem', fontSize: '0.7rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand || product.category || 'Eidula Signature'}
            </span>

            {hasVariants ? (
              <span style={{ fontSize: '0.65rem', color: '#2563eb', background: '#eff6ff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                {product.variants.length} Options
              </span>
            ) : product.unitDisplay ? (
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {product.unitDisplay}
              </span>
            ) : null}
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug || product._id}`}
            onClick={() => trackRecentlyViewed && trackRecentlyViewed(product)}
            style={{ textDecoration: 'none' }}
          >
            <h4
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.35,
                marginBottom: '0.35rem',
                minHeight: '2.45em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 0.15s ease'
              }}
              className="hover:text-emerald-700"
              title={product.name}
            >
              {tr(product.name)}
            </h4>
          </Link>

          {/* Star Rating */}
          <div style={{ marginBottom: '0.35rem' }}>
            <StarRating
              rating={product.ratings?.averageRating || 4.8}
              totalReviews={product.ratings?.totalReviews || 12}
              size={12}
            />
          </div>
        </div>

        {/* Pricing, EMI & Action Buttons */}
        <div>
          {/* Price Row */}
          <div className="flex items-baseline gap-1.5" style={{ marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            {hasVariants && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>From</span>
            )}
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {formatINR(displayPrice)}
            </span>
            {product.mrp > displayPrice && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatINR(product.mrp)}
              </span>
            )}
            {discountPercent > 0 && (
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16a34a', background: 'rgba(22, 163, 74, 0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                Save {formatINR(product.mrp - displayPrice)}
              </span>
            )}
          </div>

          {/* No-Cost EMI Pill */}
          {product.emi?.enabled && product.emi?.minMonthlyEmi > 0 ? (
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--primary-600, #166534)',
                fontWeight: 700,
                background: 'rgba(22, 101, 52, 0.06)',
                padding: '0.2rem 0.5rem',
                borderRadius: '5px',
                marginBottom: '0.65rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <CreditCard size={11} color="var(--primary-600, #166534)" />
              <span>No-Cost EMI {formatINR(product.emi.minMonthlyEmi)}/mo</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
              ✓ Free Delivery • GST Invoice Eligible
            </div>
          )}

          {/* Dual Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.35rem' }}>
            <Link
              to={`/product/${product.slug || product._id}`}
              onClick={() => trackRecentlyViewed && trackRecentlyViewed(product)}
              className="btn btn-secondary btn-sm"
              style={{
                flex: 1,
                fontSize: '0.74rem',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                justifyContent: 'center',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: 600,
                marginRight: '8px'
              }}
            >
              <Eye size={13} />
              <span>Details</span>
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn btn-sm"
              style={{
                flex: 1.4,
                fontSize: '0.74rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                justifyContent: 'center',
                background: isOutOfStock
                  ? '#94a3b8'
                  : 'linear-gradient(135deg, #051c14 0%, #166534 100%)',
                color: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                fontWeight: 700,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                boxShadow: isOutOfStock ? 'none' : '0 2px 8px rgba(22, 101, 52, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              {isAdding ? (
                <>
                  <Check size={13} color="#86efac" />
                  <span>Added!</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingCart size={13} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ShareProductModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductCard;
