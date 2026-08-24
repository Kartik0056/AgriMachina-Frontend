import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, CreditCard, ShieldCheck, Heart, Share2 } from 'lucide-react';
import StarRating from '../common/StarRating';
import ShareProductModal from './ShareProductModal';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const isFavorited = isInWishlist(product._id || product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQuantity <= 0) {
      addToast('Sorry, this product is currently out of stock.', 'warning');
      return;
    }
    addToCart(product, 1);
    addToast(`Added ${product.name} to your cart!`, 'success');
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

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative',
        height: '100%',
        width: '100%',
        minWidth: 0
      }}
      className="product-card"
    >
      {/* Top Floating Badges (Cleanly separated) */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
        {product.isDealOfTheDay && (
          <span
            className="badge"
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.68rem',
              boxShadow: '0 2px 6px rgba(225, 29, 72, 0.4)',
              letterSpacing: '0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            {product.dealBadge || '🔥 HOT DEAL'}
          </span>
        )}

        {product.discountPercent > 0 && (
          <span
            className="badge"
            style={{
              background: '#f59e0b',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.68rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}
          >
            {product.discountPercent}% OFF
          </span>
        )}

        {product.hasExtraDiscount && product.extraDiscountValue > 0 && (
          <span
            className="badge"
            style={{
              background: '#15803d',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.65rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
            }}
          >
            {product.extraDiscountType === 'PERCENT' ? `🎁 Extra ${product.extraDiscountValue}% OFF` : `🎁 Extra ₹${product.extraDiscountValue} OFF`}
          </span>
        )}
      </div>

      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 6, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {isOutOfStock ? (
          <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Out of Stock</span>
        ) : isLowStock ? (
          <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Low Stock</span>
        ) : (
          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>In Stock</span>
        )}

        <button
          type="button"
          onClick={handleShareClick}
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'transform 0.15s ease'
          }}
          className="hover:scale-110"
          title="Share this Machine"
        >
          <Share2 size={15} color="#166534" />
        </button>

        <button
          type="button"
          onClick={handleWishlistToggle}
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #e2e8f0',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'transform 0.15s ease'
          }}
          className="hover:scale-110"
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={16}
            color={isFavorited ? '#ef4444' : '#64748b'}
            fill={isFavorited ? '#ef4444' : 'none'}
          />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.slug || product._id}`}
        style={{
          display: 'block',
          width: '100%',
          height: '210px',
          backgroundColor: '#f8fafc',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <img
          src={product.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '0.75rem',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
        />
      </Link>

      {/* Product Info & Actions */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem', fontSize: '0.75rem' }}>
            <span style={{ fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {product.brand || 'AgriMachina'}
            </span>
            <span style={{ color: '#64748b' }}>
              {product.modelNumber ? `Model: ${product.modelNumber}` : ''}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.35,
                marginBottom: '0.4rem',
                minHeight: '2.7em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
              title={product.name}
            >
              {product.name}
            </h4>
          </Link>

          {/* Rating */}
          <div style={{ marginBottom: '0.5rem' }}>
            <StarRating
              rating={product.ratings?.averageRating || 0}
              totalReviews={product.ratings?.totalReviews}
              size={13}
            />
          </div>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2" style={{ marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#062416' }}>
              {formatINR(product.sellingPrice)}
            </span>
            {product.mrp > product.sellingPrice && (
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                {formatINR(product.mrp)}
              </span>
            )}
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              (Incl. GST)
            </span>
          </div>

          {/* EMI Callout */}
          {product.emi?.enabled && product.emi?.minMonthlyEmi > 0 && (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#166534',
                fontWeight: 700,
                background: '#f0fdf4',
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                marginBottom: '0.75rem',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <CreditCard size={13} color="#166534" />
              <span>EMI from <strong>{formatINR(product.emi.minMonthlyEmi)}/mo</strong></span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm flex-1"
              style={{
                opacity: isOutOfStock ? 0.6 : 1,
                fontSize: '0.85rem',
                padding: '0.5rem 0.75rem'
              }}
            >
              <ShoppingCart size={15} />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>

            <Link
              to={`/product/${product.slug || product._id}`}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.5rem 0.75rem' }}
              title="View Specifications"
            >
              <Eye size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareProductModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductCard;
