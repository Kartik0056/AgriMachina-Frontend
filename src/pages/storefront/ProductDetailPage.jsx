import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  Truck,
  FileText,
  PhoneCall,
  CheckCircle2,
  HelpCircle,
  Package,
  Wrench,
  AlertTriangle,
  Share2,
  Heart
} from 'lucide-react';
import ProductGallery from '../../components/storefront/ProductGallery';
import EMICalculatorModal from '../../components/storefront/EMICalculatorModal';
import SpecificationTable from '../../components/storefront/SpecificationTable';
import IdealForChips from '../../components/storefront/IdealForChips';
import ApplicationsGrid from '../../components/storefront/ApplicationsGrid';
import FeaturesGrid from '../../components/storefront/FeaturesGrid';
import FrequentlyBoughtTogether from '../../components/storefront/FrequentlyBoughtTogether';
import VerifiedReviewSection from '../../components/storefront/VerifiedReviewSection';
import RecommendedProducts from '../../components/storefront/RecommendedProducts';
import RecentlyViewed from '../../components/storefront/RecentlyViewed';
import StarRating from '../../components/common/StarRating';
import ProductQueryModal from '../../components/storefront/ProductQueryModal';
import ShareProductModal from '../../components/storefront/ShareProductModal';
import api from '../../services/api';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveRefresh } from '../../context/SyncContext';


const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, trackRecentlyViewed } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const fetchProductDetails = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await api.get(`/products/${slug}`);
      if (res.data.success) {
        setProduct(res.data.product);
        if (res.data.product?.variants?.length > 0) {
          const defVar = res.data.product.variants.find((v) => v.isDefault) || res.data.product.variants[0];
          setSelectedVariant(defVar);
        } else {
          setSelectedVariant(null);
        }
        trackRecentlyViewed(res.data.product);
        if (res.data.bundle) {
          setBundleData(res.data.bundle);
        }
      }
    } catch (error) {
      console.error('Failed to fetch product details', error);
      addToast('Product not found or unavailable', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProductDetails();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  // Real-time live synchronization
  useLiveRefresh((event) => {
    if (slug) {
      fetchProductDetails(true);
    }
  }, ['CATALOG_CHANGED', 'INVENTORY_UPDATED']);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The requested product listing may have been moved or archived.</p>
        <Link to="/products" className="btn btn-primary">Browse All Products</Link>
      </div>
    );
  }

  const currentPrice = (selectedVariant && selectedVariant.sellingPrice !== undefined) ? Number(selectedVariant.sellingPrice) : Number(product?.sellingPrice || product?.price || 0);
  const currentMrp = (selectedVariant && selectedVariant.mrp !== undefined) ? Number(selectedVariant.mrp) : Number(product?.mrp || currentPrice);
  const currentDiscountAmount = Math.max(0, currentMrp - currentPrice);
  const currentDiscountPercent = currentMrp > 0 ? Math.round((currentDiscountAmount / currentMrp) * 100) : (product?.discountPercent || 0);
  const currentSku = selectedVariant?.sku || product?.sku;
  const currentStockQty = selectedVariant?.stockQuantity !== undefined ? selectedVariant.stockQuantity : product?.stockQuantity;
  const isOutOfStock = currentStockQty <= 0 || product?.stockStatus === 'OUT OF STOCK';
  const isLowStock = !isOutOfStock && (currentStockQty <= 5 || product?.stockStatus === 'LOW STOCK');

  const handleAddToCart = () => {
    if (isOutOfStock) {
      addToast('Sorry, this product / variant is currently out of stock.', 'warning');
      return;
    }
    addToCart(product, quantity, selectedVariant);
    const variantTxt = selectedVariant ? ` (${selectedVariant.name})` : '';
    addToast(`Added ${quantity} x ${product.name}${variantTxt} to your cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      addToast('Sorry, this product / variant is currently out of stock.', 'warning');
      return;
    }
    addToCart(product, quantity, selectedVariant);
    if (!isAuthenticated) {
      addToast('Customer login required to proceed to Buy Now & confirm order.', 'info');
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:underline">All Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:underline">{product.category}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Top Grid: Gallery & High-Density Purchasing Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3rem',
          alignItems: 'start',
          marginBottom: '3.5rem'
        }}
      >
        {/* Left: Gallery Showcase */}
        <div style={{ position: 'sticky', top: '1.5rem' }}>
          <ProductGallery
            mainImage={product.mainImage}
            gallery={product.gallery}
            video={product.video}
          />
        </div>

        {/* Right: Technical Summary & Purchasing Actions */}
        <div className="flex flex-col gap-4">
          {/* Brand, Model, SKU & Upper Corner Share Button */}
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {product.brand} {product.modelNumber ? `• ${t('model', 'Model')}: ${product.modelNumber}` : ''}
            </span>

            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              <span style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                padding: '0.15rem 0.5rem',
                borderRadius: '5px',
                fontWeight: 600
              }}>
                {t('sku', 'SKU')}: <strong>{currentSku}</strong>
              </span>

              {/* Upper Corner Share Logo Button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.18s ease',
                  flexShrink: 0
                }}
                className="hover:scale-110"
                title={t('share_product', 'Share Product (WhatsApp, FB, Insta, Link)')}
              >
                <Share2 size={13} color="var(--primary-500, #16a34a)" />
              </button>
            </div>
          </div>

          {/* Title and Unit Badge */}
          <div>
            <h1 style={{ fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.35, margin: '0 0 0.3rem 0', fontWeight: 650, letterSpacing: '-0.01em' }}>
              {product.name}
            </h1>
            {(selectedVariant?.quantity || product.unitDisplay || (product.netQuantity && product.unit)) && (
              <span className="badge badge-primary" style={{ fontSize: '0.65rem', background: 'var(--primary-50, #dcfce7)', color: 'var(--primary-600, #166534)', fontWeight: 700, border: '1px solid var(--border-color, #86efac)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                📦 Net Quantity / Size: <strong>{selectedVariant ? (selectedVariant.quantity && selectedVariant.unit ? `${selectedVariant.quantity} ${selectedVariant.unit}` : selectedVariant.name) : (product.unitDisplay || `${product.netQuantity} ${product.unit}`)}</strong>
              </span>
            )}
          </div>

          {/* Ratings & Verified Reviews Summary */}
          <div className="flex items-center gap-2">
            <StarRating
              rating={product.ratings?.averageRating || 0}
              totalReviews={product.ratings?.totalReviews}
              size={13}
            />
            {product.ratings?.totalReviews > 0 && (
              <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '0.12rem 0.4rem' }}>
                <ShieldCheck size={10} /> {t('verified_reviews', '100% Verified Customer Reviews')}
              </span>
            )}
          </div>

          {/* Pack Size / Variant Selection Pills */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ background: 'var(--bg-surface-alt)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginTop: '0.35rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Select Pack Size / Weight / Variant:</span>
                <span style={{ color: 'var(--primary-600, #166534)', fontWeight: 800 }}>{selectedVariant?.name}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {product.variants.map((v, vIdx) => {
                  const isSelected = selectedVariant?.name === v.name;
                  return (
                    <button
                      key={vIdx}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '7px',
                        border: isSelected ? '2px solid var(--primary-500, #16a34a)' : '1px solid var(--border-color)',
                        background: isSelected ? 'var(--primary-50, rgba(22, 101, 52, 0.12))' : 'var(--bg-surface)',
                        color: isSelected ? 'var(--primary-600, #166534)' : 'var(--text-main)',
                        cursor: 'pointer',
                        fontWeight: isSelected ? 800 : 600,
                        boxShadow: isSelected ? '0 2px 6px rgba(0, 0, 0, 0.12)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '0.78rem' }}>{v.name}</span>
                      <span style={{ fontSize: '0.68rem', color: isSelected ? 'var(--primary-500, #15803d)' : 'var(--text-muted)', marginTop: '1px', fontWeight: 700 }}>
                        {formatINR(v.sellingPrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.15rem 0' }} />

          {/* Deal of the Day Banner */}
          {product.isDealOfTheDay && (
            <div
              style={{
                background: 'linear-gradient(135deg, #7c2d12, #991b1b)',
                color: '#ffffff',
                padding: '0.6rem 1rem',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="badge" style={{ background: '#ef4444', color: '#ffffff', fontWeight: 800, fontSize: '0.68rem' }}>
                  {product.dealBadge || '🔥 SUPER DEAL OF THE DAY'}
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#fef08a' }}>
                  Special limited-quota discount active!
                </span>
              </div>
            </div>
          )}

          {/* Pricing Box */}
          <div style={{ background: 'var(--bg-surface-alt)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div className="flex items-baseline gap-2.5" style={{ flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.015em' }}>
                {formatINR(currentPrice)}
              </span>
              {currentMrp > currentPrice && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  {formatINR(currentMrp)}
                </span>
              )}
              {currentDiscountPercent > 0 && (
                <span className="badge badge-accent" style={{ fontSize: '0.68rem', background: '#f59e0b', color: '#ffffff', fontWeight: 700, padding: '0.12rem 0.45rem' }}>
                  {t('save', 'Save')} {currentDiscountPercent}% ({formatINR(currentDiscountAmount)})
                </span>
              )}
              {product.hasExtraDiscount && product.extraDiscountValue > 0 && (
                <span className="badge" style={{ fontSize: '0.68rem', background: '#16a34a', color: '#ffffff', fontWeight: 800, padding: '0.12rem 0.45rem' }}>
                  {product.extraDiscountType === 'PERCENT' ? `🎁 Extra ${product.extraDiscountValue}% OFF` : `🎁 Extra ₹${product.extraDiscountValue} OFF`}
                </span>
              )}
            </div>

            {/* Extra Discount Announcement */}
            {product.hasExtraDiscount && product.extraDiscountLabel && (
              <div style={{ background: 'var(--primary-50)', border: '1px solid var(--border-color, #86efac)', borderRadius: '6px', padding: '0.35rem 0.55rem', marginTop: '0.45rem', fontSize: '0.7rem', color: 'var(--primary-600, #166534)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>🏷️ <strong>{t('extra_discount', 'Special Offer')}:</strong> {product.extraDiscountLabel}</span>
              </div>
            )}

            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Price inclusive of <strong>{product.gstPercent || 12}% GST</strong> (HSN: {product.hsnCode || '8432'}). GST Input Tax Credit available on commercial invoice.
            </div>
          </div>

          {/* EASY EMI AVAILABLE BANNER */}
          {product.emi?.enabled && product.emi?.minMonthlyEmi > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #0c3e27, #166534)',
              color: '#ffffff',
              padding: '0.65rem 0.85rem',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.45rem'
            }}>
              <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('emi_starting', 'EASY 0% NO-COST EMI AVAILABLE')}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fef08a' }}>
                  Starting from {formatINR(product.emi.minMonthlyEmi)} / month
                </div>
                <div style={{ fontSize: '0.62rem', color: '#dcfce7' }}>
                  Flexible 3 to 36 months tenures with leading Indian banks
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEMIModalOpen(true)}
                className="btn btn-accent btn-sm"
                style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 700, fontSize: '0.68rem', padding: '0.25rem 0.55rem' }}
              >
                <CreditCard size={12} />
                <span>{t('view_emi_plans', 'View EMI Plans')}</span>
              </button>
            </div>
          )}

          {/* Stock Availability */}
          <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
            {isOutOfStock ? (
              <span className="badge badge-danger" style={{ background: 'var(--bg-surface)', color: '#ef4444', border: '1px solid #fca5a5', fontSize: '0.66rem', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>{t('out_of_stock', 'Out of Stock')}</span>
            ) : isLowStock ? (
              <span className="badge badge-warning" style={{ background: 'var(--bg-surface)', color: '#f59e0b', border: '1px solid #fcd34d', fontSize: '0.66rem', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>⚡ {t('low_stock', 'Low Stock: Only')} {currentStockQty} remaining</span>
            ) : (
              <span className="badge badge-success" style={{ background: 'var(--bg-surface)', color: '#16a34a', border: '1px solid #86efac', fontSize: '0.66rem', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>✓✓ {t('in_stock', 'IN STOCK – READY FOR EXPRESS DISPATCH')}</span>
            )}
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              • Dispatches from {product.warehouse || 'Jaipur Craftworks Hub'}
            </span>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="flex flex-col gap-2" style={{ marginTop: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Quantity */}
              <div className="flex items-center" style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', height: '36px', marginRight: '6px' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '30px', height: '36px', background: 'var(--bg-surface-alt)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
                >
                  -
                </button>
                <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-main)' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: '30px', height: '36px', border: 'none', background: 'var(--bg-surface-alt)', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
                >
                  +
                </button>
              </div>

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  border: '1px solid',
                  borderColor: isInWishlist(product._id || product.id) ? '#fca5a5' : 'var(--border-color)',
                  background: isInWishlist(product._id || product.id) ? '#fef2f2' : 'var(--bg-surface)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginRight: '6px',
                  transition: 'all 0.15s ease'
                }}
                title={isInWishlist(product._id || product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  size={16}
                  color={isInWishlist(product._id || product.id) ? '#ef4444' : '#64748b'}
                  fill={isInWishlist(product._id || product.id) ? '#ef4444' : 'none'}
                />
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{
                  height: '36px',
                  padding: '0 0.85rem',
                  borderRadius: '6px',
                  border: '1.5px solid var(--primary-600, #166534)',
                  background: 'transparent',
                  color: 'var(--primary-600, #166534)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  flex: 1,
                  marginRight: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShoppingCart size={15} />
                <span>{t('add_to_cart', 'Add to Cart')}</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                style={{
                  height: '36px',
                  padding: '0 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #166534, #15803d)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  flex: 1,
                  boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{t('buy_now', 'Buy Now')}</span>
              </button>
            </div>

            {/* Shopping AI Assistant & WhatsApp Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsQueryModalOpen(true)}
                style={{
                  height: '32px',
                  padding: '0 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #86efac)',
                  background: 'var(--primary-50)',
                  color: 'var(--primary-600, #166534)',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  flex: 1,
                  marginRight: '6px'
                }}
              >
                <HelpCircle size={14} color="var(--primary-600, #166534)" />
                <span>{t('ask_specialist', 'Ask Shopping AI Assistant')}</span>
              </button>

              <a
                href={`https://wa.me/916395211953?text=${encodeURIComponent(
                  `Hello Eidula! 👋\n\nI am interested in this product:\n✨ *Product:* ${product.name}\n🔖 *SKU:* ${product.sku || 'N/A'}\n💰 *Price:* ₹${product.sellingPrice?.toLocaleString('en-IN')}\n🔗 *Direct Link:* ${typeof window !== 'undefined' ? window.location.origin : ''}/product/${product.slug || product._id}\n\nPlease share product details, availability, and discount options!`
                )}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  height: '32px',
                  padding: '0 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #075e54',
                  background: '#075e54',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  textDecoration: 'none',
                  flex: 1
                }}
              >
                <PhoneCall size={13} />
                <span>{t('whatsapp_advisor', 'WhatsApp Shopping Assistant')}</span>
              </a>
            </div>
          </div>

          {/* Shipping & Delivery Quick Info */}
          <div className="grid grid-cols-2 gap-2" style={{ marginTop: '0.35rem', background: 'var(--bg-surface-alt)', padding: '0.55rem 0.75rem', borderRadius: '8px', fontSize: '0.72rem', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-1.5">
              <Truck size={15} color="var(--primary-600, #166534)" style={{ flexShrink: 0 }} />
              <span><strong>{t('free_delivery', 'Free Pan-India Delivery')}</strong> on orders over ₹4,999</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} color="var(--primary-600, #166534)" style={{ flexShrink: 0 }} />
              <span><strong>{product.warranty?.period || t('warranty', '1 Year Electrical Warranty')}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <IdealForChips idealFor={product.idealFor} />
      </div>

      {bundleData && bundleData.bundle && bundleData.bundle.length > 0 && (
        <div style={{ marginBottom: '3.5rem' }}>
          <FrequentlyBoughtTogether bundleData={bundleData} />
        </div>
      )}

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: 700 }}>{t('overview_title', 'Product Overview & Specifications')}</h3>
        {product.description ? (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-main)' }}
          />
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{product.shortDescription}</p>
        )}
      </div>

      {product.specifications && product.specifications.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 700 }}>
            {t('specifications_title', 'Technical Specifications & Parameters')}
          </h2>
          <SpecificationTable specifications={product.specifications} />
        </div>
      )}

      {product.applications && product.applications.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <ApplicationsGrid applications={product.applications} />
        </div>
      )}

      {product.features && product.features.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <FeaturesGrid features={product.features} />
        </div>
      )}

      {product.whatsIncluded && product.whatsIncluded.length > 0 && (
        <div style={{ background: 'var(--bg-surface-alt)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Package size={18} color="#166534" />
            <span>{t('whats_in_box', "What's Included in the Box")}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {product.whatsIncluded.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2" style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: '7px', border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.compatibility && (product.compatibility.compatibleAttachments?.length > 0 || product.compatibility.compatibleBrands?.length > 0) && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Wrench size={18} color="#166534" />
            <span>Compatibility & Matching Implements</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {product.compatibility.compatibleAttachments?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Compatible PTO Attachments:</div>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibility.compatibleAttachments.map((att, idx) => (
                    <span key={idx} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{att}</span>
                  ))}
                </div>
              </div>
            )}
            {product.compatibility.compatibleBrands?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Compatible OEM Brands:</div>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibility.compatibleBrands.map((b, idx) => (
                    <span key={idx} className="badge badge-gold" style={{ fontSize: '0.7rem' }}>{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '2.5rem' }}>
        {/* Warranty */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
            <ShieldCheck size={18} color="#166534" />
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>Warranty & Service Guarantee</h4>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700, marginBottom: '0.25rem' }}>
            {product.warranty?.period || '1 Year Manufacturer Warranty'} ({product.warranty?.type || 'Comprehensive OEM Coverage'})
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
            {product.warranty?.terms || 'Full coverage on engine block, transmission gearbox, and chassis structural welds.'}
          </p>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Provider: {product.warranty?.provider || 'OEM Authorized Service Center Network'}
          </div>
        </div>

        {/* Shipping */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.25rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
            <Truck size={18} color="#166534" />
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>Shipping & Logistics</h4>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.25rem' }}>
            Estimated Delivery: {product.shipping?.estimatedDeliveryDays || '4 - 7 Business Days'}
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
            Secure doorstep delivery with live tracking and insured transit.
          </p>
          {product.shipping?.installationAvailable && (
            <div className="badge badge-success" style={{ fontSize: '0.68rem' }}>
              ✓ Free Field Demonstration & Video Setup Guide
            </div>
          )}
        </div>
      </div>

      {product.faqs && product.faqs.length > 0 && (
        <div style={{ background: 'var(--bg-surface-alt)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', marginBottom: '3.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="flex flex-col gap-3">
            {product.faqs.map((faq, idx) => (
              <div key={idx} style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Q: {faq.question}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  A: {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '3.5rem' }}>
        <VerifiedReviewSection
          productId={product._id}
          productName={product.name}
          initialRatings={product.ratings}
        />
      </div>

      <RecommendedProducts productId={product._id} title="You May Also Like" />

      <RecentlyViewed currentProductId={product._id} hideWhenEmpty={true} />

      <EMICalculatorModal
        isOpen={isEMIModalOpen}
        onClose={() => setIsEMIModalOpen(false)}
        productPrice={product.sellingPrice}
        emiConfig={product.emi || {}}
      />

      <ProductQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        product={product}
      />

      <ShareProductModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailPage;
