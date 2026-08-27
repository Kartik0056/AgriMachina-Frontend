import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, CreditCard, ShieldCheck, Heart, Share2 } from 'lucide-react';
import StarRating from '../common/StarRating';
import ShareProductModal from './ShareProductModal';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ product }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const { t, tr } = useLanguage();

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
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all var(--transition-normal)'
      }}
      className="hover-card group"
    >
      {/* Floating Badges & Action Icons */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '4px', pointerEvents: 'none' }}>
        {/* Deal Badge */}
        {product.isDealOfTheDay && (
          <span
            className="badge"
            style={{
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.65rem',
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            🔥 {product.dealBadge || 'HOT DEAL'}
          </span>
        )}

        {/* Extra Coupon / Discount Tag */}
        {product.hasExtraDiscount && product.extraDiscountValue > 0 && (
          <span
            className="badge"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.65rem',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.35)'
            }}
          >
            🎁 {product.extraDiscountType === 'PERCENT' ? `Extra ${product.extraDiscountValue}% OFF` : `Extra ₹${product.extraDiscountValue} OFF`}
          </span>
        )}

        {/* Stock Badges */}
        {isOutOfStock ? (
          <span className="badge badge-danger" style={{ fontSize: '0.65rem', fontWeight: 800 }}>
            {t('out_of_stock', 'Sold Out')}
          </span>
        ) : isLowStock ? (
          <span className="badge badge-warning" style={{ fontSize: '0.65rem', fontWeight: 800 }}>
            ⚡ {t('low_stock', 'Low Stock')}
          </span>
        ) : null}
      </div>

      {/* Top Right Floating Action Badges (Wishlist & Share) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          style={{
            background: isFavorited ? '#fee2e2' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            border: isFavorited ? '1px solid #fecdd3' : '1px solid rgba(0,0,0,0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            transition: 'all 0.15s ease'
          }}
          className="hover:scale-110 active:scale-95"
          title={isFavorited ? 'Remove from Saved Wishlist' : 'Save to Wishlist'}
        >
          <Heart
            size={16}
            color={isFavorited ? '#dc2626' : '#64748b'}
            fill={isFavorited ? '#dc2626' : 'none'}
          />
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareClick}
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            color: '#166534',
            transition: 'all 0.15s ease'
          }}
          className="hover:scale-110 active:scale-95"
          title="Share Equipment / WhatsApp / Link"
        >
          <Share2 size={15} color="#166534" />
        </button>
      </div>

      {/* Product Image Stage */}
      <Link
        to={`/product/${product.slug || product._id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '215px',
          backgroundColor: 'var(--bg-surface-alt)',
          overflow: 'hidden',
          position: 'relative',
          padding: '1rem'
        }}
      >
        <img
          src={product.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&q=80'}
          alt={product.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.08))'
          }}
          loading="lazy"
        />
      </Link>

      {/* Product Info & Actions */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: '0.85rem' }}>
        <div>
          {/* Brand, Unit / Variants Badge & Model */}
          {(() => {
            const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
            const unitBadgeText = product.unitDisplay || (product.netQuantity && product.unit ? `${product.netQuantity} ${product.unit}` : (product.unit && product.unit !== 'unit' && product.unit !== 'pcs' ? product.unit : ''));
            return (
              <div className="flex items-center justify-between" style={{ marginBottom: '0.35rem', fontSize: '0.75rem', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {product.brand || 'AgriMachina'}
                </span>
                <div className="flex items-center gap-1">
                  {hasVariants ? (
                    <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', border: '1px solid #bfdbfe' }}>
                      {product.variants.length} Sizes
                    </span>
                  ) : unitBadgeText ? (
                    <span className="badge" style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', border: '1px solid #bbf7d0' }}>
                      {unitBadgeText}
                    </span>
                  ) : product.modelNumber ? (
                    <span style={{ color: 'var(--text-muted)' }}>
                      {product.modelNumber}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })()}

          {/* Title */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
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
              {tr(product.name)}
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
          {(() => {
            const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
            const minVarPrice = hasVariants ? Math.min(...product.variants.map((v) => Number(v.sellingPrice) || product.sellingPrice)) : product.sellingPrice;
            const displayPrice = hasVariants ? minVarPrice : product.sellingPrice;
            return (
              <div className="flex items-baseline gap-2" style={{ marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                {hasVariants && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>From</span>
                )}
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {formatINR(displayPrice)}
                </span>
                {product.mrp > displayPrice && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {formatINR(product.mrp)}
                  </span>
                )}
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ({t('incl_gst', 'Incl. GST')})
                </span>
              </div>
            );
          })()}

          {/* EMI Callout */}
          {product.emi?.enabled && product.emi?.minMonthlyEmi > 0 && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary-600, #166534)',
                fontWeight: 700,
                background: 'var(--primary-50)',
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                marginBottom: '0.75rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <CreditCard size={13} color="#166534" />
              <span>{t('monthly_emi_text', 'EMI from')} {formatINR(product.emi.minMonthlyEmi)}/mo</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/product/${product.slug || product._id}`}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
            >
              <Eye size={14} />
              <span>{t('view_details', 'View')}</span>
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{
                flex: 1.2,
                justifyContent: 'center',
                background: isOutOfStock ? '#94a3b8' : 'var(--primary-600, #166534)',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              <ShoppingCart size={14} />
              <span>{isOutOfStock ? t('out_of_stock', 'Sold Out') : t('add_to_cart', 'Add to Cart')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareProductModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductCard;
