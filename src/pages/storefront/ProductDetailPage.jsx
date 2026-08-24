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
  Play,
  Download,
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
import { useToast } from '../../context/ToastContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, trackRecentlyViewed } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [bundleData, setBundleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          trackRecentlyViewed(res.data.product);

          // Fetch frequently bought together bundle
          try {
            const bundleRes = await api.get(`/products/${res.data.product._id}/frequently-bought-together`);
            if (bundleRes.data.success) {
              setBundleData(bundleRes.data.bundle);
            }
          } catch (e) {}
        }
      } catch (error) {
        console.error('Failed to load product detail', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading agricultural machinery details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>The requested equipment listing may have been moved or archived.</p>
        <Link to="/products" className="btn btn-primary">Browse Machinery</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) {
      addToast('Sorry, this machine is currently out of stock.', 'warning');
      return;
    }
    addToCart(product, quantity);
    addToast(`Added ${quantity} x ${product.name} to your cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (product.stockQuantity <= 0) {
      addToast('Sorry, this machine is currently out of stock.', 'warning');
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const isLowStock = product.stockStatus === 'LOW STOCK';
  const isOutOfStock = product.stockStatus === 'OUT OF STOCK' || product.stockQuantity <= 0;

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2" style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:underline">Machinery</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:underline">{product.category}</Link>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Top Grid: Gallery & High-Density Purchasing Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10" style={{ marginBottom: '3.5rem' }}>
        {/* Left: Gallery */}
        <div>
          <ProductGallery
            mainImage={product.mainImage}
            gallery={product.gallery}
            video={product.video}
          />
        </div>

        {/* Right: Technical Summary & Purchasing Actions */}
        <div className="flex flex-col gap-4">
          {/* Brand & Model */}
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.brand} {product.modelNumber ? `• Model: ${product.modelNumber}` : ''}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              SKU: <strong>{product.sku}</strong>
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '1.85rem', color: '#062416', lineHeight: 1.25 }}>
            {product.name}
          </h1>

          {/* Ratings & Verified Reviews Summary */}
          <div className="flex items-center gap-3">
            <StarRating
              rating={product.ratings?.averageRating || 0}
              totalReviews={product.ratings?.totalReviews}
              size={18}
            />
            {product.ratings?.totalReviews > 0 && (
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={13} /> 100% Verified Farmer Reviews
              </span>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />

          {/* Deal of the Day Banner */}
          {product.isDealOfTheDay && (
            <div
              style={{
                background: 'linear-gradient(135deg, #7c2d12, #991b1b)',
                color: '#ffffff',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="badge" style={{ background: '#ef4444', color: '#ffffff', fontWeight: 900, fontSize: '0.75rem' }}>
                  {product.dealBadge || '🔥 SUPER DEAL OF THE DAY'}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fef08a' }}>
                  Special limited-quota farmer discount active!
                </span>
              </div>
            </div>
          )}

          {/* Pricing Box */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div className="flex items-baseline gap-3" style={{ flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#062416' }}>
                {formatINR(product.sellingPrice)}
              </span>
              {product.mrp > product.sellingPrice && (
                <span style={{ fontSize: '1.15rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  {formatINR(product.mrp)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="badge badge-accent" style={{ fontSize: '0.85rem', background: '#f59e0b', color: '#ffffff' }}>
                  Save {product.discountPercent}% ({formatINR(product.discountAmount)})
                </span>
              )}
              {product.hasExtraDiscount && product.extraDiscountValue > 0 && (
                <span className="badge" style={{ fontSize: '0.85rem', background: '#16a34a', color: '#ffffff', fontWeight: 800 }}>
                  {product.extraDiscountType === 'PERCENT' ? `🎁 Extra ${product.extraDiscountValue}% OFF` : `🎁 Extra ₹${product.extraDiscountValue} OFF`}
                </span>
              )}
            </div>

            {/* Extra Discount Announcement */}
            {product.hasExtraDiscount && product.extraDiscountLabel && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '0.5rem 0.75rem', marginTop: '0.75rem', fontSize: '0.85rem', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🏷️ <strong>Special Offer:</strong> {product.extraDiscountLabel}</span>
              </div>
            )}

            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
              Price inclusive of <strong>{product.gstPercent || 12}% GST</strong> (HSN: {product.hsnCode || '8432'}). GST Input Tax Credit available on commercial invoice.
            </div>
          </div>

          {/* EASY EMI AVAILABLE BANNER */}
          {product.emi?.enabled && product.emi?.minMonthlyEmi > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #0c3e27, #166534)',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  EASY KISAN EMI AVAILABLE
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fef08a' }}>
                  Starting from {formatINR(product.emi.minMonthlyEmi)} / month
                </div>
                <div style={{ fontSize: '0.7rem', color: '#dcfce7' }}>
                  Flexible 3 to 36 months tenures with leading agricultural banks
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEMIModalOpen(true)}
                className="btn btn-accent btn-sm"
                style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 700 }}
              >
                <CreditCard size={15} />
                <span>View EMI Plans</span>
              </button>
            </div>
          )}

          {/* Stock Availability */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <span className="badge badge-danger">Out of Stock</span>
            ) : isLowStock ? (
              <span className="badge badge-warning">⚡ Low Stock: Only {product.stockQuantity} machines remaining</span>
            ) : (
              <span className="badge badge-success">✓ In Stock & Ready for Immediate Dispatch</span>
            )}
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              • Dispatches from {product.warehouse || 'Central Agro Hub'}
            </span>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="flex flex-col gap-3" style={{ marginTop: '0.5rem' }}>
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '38px', height: '42px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                >
                  -
                </button>
                <span style={{ width: '45px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: '36px', height: '36px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 700 }}
                >
                  +
                </button>
              </div>

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="btn btn-secondary btn-lg"
                style={{
                  padding: '0 0.85rem',
                  borderColor: isInWishlist(product._id || product.id) ? '#fca5a5' : '#cbd5e1',
                  background: isInWishlist(product._id || product.id) ? '#fef2f2' : '#ffffff'
                }}
                title={isInWishlist(product._id || product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  size={20}
                  color={isInWishlist(product._id || product.id) ? '#ef4444' : '#64748b'}
                  fill={isInWishlist(product._id || product.id) ? '#ef4444' : 'none'}
                />
              </button>

              {/* Share Product Button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="btn btn-secondary btn-lg"
                style={{
                  padding: '0 0.85rem',
                  borderColor: '#86efac',
                  background: '#f0fdf4',
                  color: '#166534'
                }}
                title="Share this machinery with farmers & friends"
              >
                <Share2 size={20} color="#166534" />
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-secondary btn-lg flex-1"
                style={{ border: '2px solid #166534', color: '#166534', fontWeight: 700 }}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn btn-primary btn-lg flex-1"
              >
                <span>Buy Now</span>
              </button>
            </div>

            {/* WhatsApp Agronomy Expert Advice & Share Modal Trigger Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="btn btn-secondary btn-md flex-1"
                style={{ background: '#f8fafc', borderColor: '#cbd5e1', color: '#0f172a', fontWeight: 700, padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Share2 size={16} color="#166534" />
                <span>Share (WhatsApp / FB / Insta)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQueryModalOpen(true)}
                className="btn btn-secondary btn-md flex-1"
                style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#166534', fontWeight: 700, padding: '0.65rem 1rem' }}
              >
                <HelpCircle size={17} color="#166534" />
                <span>Ask Specialist / Query</span>
              </button>

              <a
                href={`https://wa.me/919027799171?text=${encodeURIComponent(
                  `Namaste AgriMachina! 🙏\n\nI am interested in this farm machine:\n🚜 *Product:* ${product.name}\n🔖 *SKU:* ${product.sku}\n💰 *Price:* ₹${product.sellingPrice?.toLocaleString('en-IN')}\n🔗 *Direct Link:* ${window.location.origin}/product/${product.slug}\n\nPlease share field demo videos, subsidy assistance, and best discount options!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-dark btn-md flex-1"
                style={{ background: '#075e54', borderColor: '#075e54', color: '#ffffff', padding: '0.65rem 1rem' }}
              >
                <PhoneCall size={16} />
                <span>WhatsApp Advisor</span>
              </a>
            </div>
          </div>

          {/* Shipping & Delivery Quick Info */}
          <div className="grid grid-cols-2 gap-3" style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', fontSize: '0.8rem', color: '#334155' }}>
            <div className="flex items-center gap-2">
              <Truck size={18} color="#166534" />
              <span><strong>Free Delivery</strong> on orders over ₹4,999 (Pan-India)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} color="#166534" />
              <span><strong>{product.warranty?.period || '1 Year Manufacturer Warranty'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: IDEAL FOR CHIPS (REQUIRED) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <IdealForChips idealFor={product.idealFor} />
      </div>

      {/* SECTION 2: FREQUENTLY BOUGHT TOGETHER BUNDLE */}
      {bundleData && bundleData.bundle && bundleData.bundle.length > 0 && (
        <div style={{ marginBottom: '3.5rem' }}>
          <FrequentlyBoughtTogether bundleData={bundleData} />
        </div>
      )}

      {/* SECTION 3: TECHNICAL DESCRIPTION & WORKING OVERVIEW */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <h3 style={{ fontSize: '1.4rem', color: '#062416', marginBottom: '1rem' }}>Product Overview & Operating Capabilities</h3>
        {product.description ? (
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#334155' }}
          />
        ) : (
          <p style={{ color: '#64748b' }}>{product.shortDescription}</p>
        )}
      </div>

      {/* SECTION 4: DYNAMIC SPECIFICATIONS BUILDER TABLE */}
      {product.specifications && product.specifications.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#062416', marginBottom: '1.25rem' }}>
            Technical Specifications & Engineering Matrix
          </h2>
          <SpecificationTable specifications={product.specifications} />
        </div>
      )}

      {/* SECTION 5: APPLICATIONS GRID */}
      {product.applications && product.applications.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <ApplicationsGrid applications={product.applications} />
        </div>
      )}

      {/* SECTION 6: KEY FEATURES */}
      {product.features && product.features.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <FeaturesGrid features={product.features} />
        </div>
      )}

      {/* SECTION 7: WHAT'S INCLUDED IN THE BOX */}
      {product.whatsIncluded && product.whatsIncluded.length > 0 && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#062416', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={22} color="#166534" />
            <span>What's Included in the Package</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {product.whatsIncluded.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2" style={{ background: '#ffffff', padding: '0.65rem 0.95rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#1e293b' }}>
                <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: COMPATIBILITY ATTACHMENTS */}
      {product.compatibility && (product.compatibility.compatibleAttachments?.length > 0 || product.compatibility.compatibleBrands?.length > 0) && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#062416', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={22} color="#166534" />
            <span>Compatibility & Matching Implements</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.compatibility.compatibleAttachments?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Compatible PTO Attachments:</div>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.compatibleAttachments.map((att, idx) => (
                    <span key={idx} className="badge badge-primary">{att}</span>
                  ))}
                </div>
              </div>
            )}
            {product.compatibility.compatibleBrands?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Compatible OEM Brands:</div>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.compatibleBrands.map((b, idx) => (
                    <span key={idx} className="badge badge-gold">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 9: WARRANTY & SHIPPING DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '3.5rem' }}>
        {/* Warranty */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <ShieldCheck size={22} color="#166534" />
            <h4 style={{ fontSize: '1.1rem', color: '#062416' }}>Warranty & Service Guarantee</h4>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700, marginBottom: '0.35rem' }}>
            {product.warranty?.period || '1 Year Manufacturer Warranty'} ({product.warranty?.type || 'Comprehensive OEM Coverage'})
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            {product.warranty?.terms || 'Full coverage on engine block, transmission gearbox, and chassis structural welds.'}
          </p>
          <div style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
            Provider: {product.warranty?.provider || 'OEM Authorized Service Center Network'}
          </div>
        </div>

        {/* Shipping */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <Truck size={22} color="#166534" />
            <h4 style={{ fontSize: '1.1rem', color: '#062416' }}>Shipping & Installation</h4>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.35rem' }}>
            Estimated Delivery: {product.shipping?.estimatedDeliveryDays || '4 - 7 Business Days'}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            Secure palletized heavy transport with doorstep hydraulic tail-lift delivery directly to your farm gate.
          </p>
          {product.shipping?.installationAvailable && (
            <div className="badge badge-success" style={{ fontSize: '0.75rem' }}>
              ✓ Free Field Demonstration & Video Setup Guide
            </div>
          )}
        </div>
      </div>

      {/* SECTION 10: FREQUENTLY ASKED QUESTIONS */}
      {product.faqs && product.faqs.length > 0 && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', marginBottom: '3.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', color: '#062416', marginBottom: '1.25rem' }}>
            Frequently Asked Farmer Questions (FAQ)
          </h3>
          <div className="flex flex-col gap-3">
            {product.faqs.map((faq, idx) => (
              <div key={idx} style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                  Q: {faq.question}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  A: {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 11: VERIFIED CUSTOMER REVIEWS */}
      <div style={{ marginBottom: '3.5rem' }}>
        <VerifiedReviewSection
          productId={product._id}
          productName={product.name}
          initialRatings={product.ratings}
        />
      </div>

      {/* SECTION 12: RECOMMENDATION CAROUSELS */}
      <RecommendedProducts productId={product._id} title="You May Also Like" />

      {/* SECTION 13: RECENTLY VIEWED */}
      <RecentlyViewed currentProductId={product._id} />

      {/* EMI CALCULATOR MODAL */}
      <EMICalculatorModal
        isOpen={isEMIModalOpen}
        onClose={() => setIsEMIModalOpen(false)}
        productPrice={product.sellingPrice}
        emiConfig={product.emi || {}}
      />

      {/* PRODUCT QUERY / TECHNICAL ADVISORY MODAL */}
      <ProductQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        product={product}
      />

      {/* SHARE FARM EQUIPMENT MODAL */}
      <ShareProductModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailPage;
