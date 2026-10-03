import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  PhoneCall,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Award,
  Zap,
  Tag
} from 'lucide-react';
import HeroSlider from '../../components/storefront/HeroSlider';
import AmazonQuadCards from '../../components/storefront/AmazonQuadCards';
import LightningDealsSection from '../../components/storefront/LightningDealsSection';
import BrandStorefrontSection from '../../components/storefront/BrandStorefrontSection';
import ProductCard from '../../components/storefront/ProductCard';
import RecentlyViewed from '../../components/storefront/RecentlyViewed';
import api from '../../services/api';
import { useLiveRefresh } from '../../context/SyncContext';

const TESTIMONIALS = [
  {
    name: 'Vikram Malhotra',
    location: 'New Delhi',
    rating: 5,
    title: 'Supreme Quality Kashmiri Saffron & Spices',
    comment: 'The aroma and color of the Grade-1 Kashmiri Saffron and Lakadong Turmeric are unmatched. Delivery was fast and GST tax invoice was attached for my commercial catering business.',
    productName: 'Kashmiri Saffron (1g)',
    verified: true
  },
  {
    name: 'Ananya Deshmukh',
    location: 'Bengaluru',
    rating: 5,
    title: 'Acoustic Earbuds & Ceramic Lamp Exceeded Expectations',
    comment: 'Ordered the UltraSound Pro earbuds and the artisan ceramic table lamp. Both arrived meticulously packaged within 48 hours. Beautiful aesthetics and amazing build quality!',
    productName: 'UltraSound Pro ANC Earbuds',
    verified: true
  },
  {
    name: 'Rohan Singhania',
    location: 'Jaipur',
    rating: 5,
    title: 'Heavy-Duty Mixer Grinder with 0% No-Cost EMI',
    comment: 'Opted for 6 months No-Cost EMI via Razorpay. Seamless approval, zero extra fees, and the 1000W copper motor handles tough spices effortlessly. Highly recommend Eidula!',
    productName: '1000W Copper Mixer Grinder',
    verified: true
  }
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');

  const loadHomeData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=12'),
        api.get('/categories')
      ]);
      if (prodRes.data.success) setFeaturedProducts(prodRes.data.products || []);
      if (catRes.data.success) setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error('Home data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  useLiveRefresh(loadHomeData, ['CATALOG_CHANGED', 'INVENTORY_UPDATED', 'CATEGORY_CHANGED', 'DEALS_UPDATED']);

  // Filter products by selected tab
  const displayedProducts = useMemo(() => {
    if (selectedCategoryTab === 'All') return featuredProducts;
    return featuredProducts.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      if (selectedCategoryTab === 'Spices') return cat.includes('spice') || cat.includes('masale');
      if (selectedCategoryTab === 'Electronics') return cat.includes('electronic') || cat.includes('gadget');
      if (selectedCategoryTab === 'Decor') return cat.includes('decor') || cat.includes('living');
      if (selectedCategoryTab === 'Kitchen') return cat.includes('kitchen') || cat.includes('appliance');
      return true;
    });
  }, [featuredProducts, selectedCategoryTab]);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      {/* 1. Main Hero Slider */}
      <HeroSlider />

      {/* 2. Curated Bento Collections */}
      <AmazonQuadCards />

      {/* 3. Flash Deals & Super Offers Pavilion */}
      <LightningDealsSection />

      {/* 4. Luxury Guarantees & White-Glove Service Skeuomorphic Cards */}
      <section style={{ margin: '3.5rem 0 4.5rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Genuine Quality */}
            <div
              className="skeuo-card skeuo-card-interactive"
              style={{
                padding: '1.4rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div
                className="skeuo-icon-medallion"
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  border: '1px solid #a7f3d0',
                  color: '#047857',
                  '--skeuo-glow': 'rgba(16, 185, 129, 0.3)'
                }}
              >
                <ShieldCheck size={26} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.015em',
                    marginBottom: '0.3rem',
                    lineHeight: 1.3
                  }}
                >
                  100% Genuine Quality
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45
                  }}
                >
                  Certified purity & direct brand warranty
                </div>
              </div>
            </div>

            {/* 2. No-Cost EMI */}
            <div
              className="skeuo-card skeuo-card-interactive"
              style={{
                padding: '1.4rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div
                className="skeuo-icon-medallion"
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  border: '1px solid #fde68a',
                  color: '#b45309',
                  '--skeuo-glow': 'rgba(245, 158, 11, 0.3)'
                }}
              >
                <CreditCard size={26} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.015em',
                    marginBottom: '0.3rem',
                    lineHeight: 1.3
                  }}
                >
                  0% No-Cost EMI
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45
                  }}
                >
                  Instant approval via Razorpay & top banks
                </div>
              </div>
            </div>

            {/* 3. Fast Logistics */}
            <div
              className="skeuo-card skeuo-card-interactive"
              style={{
                padding: '1.4rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div
                className="skeuo-icon-medallion"
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  border: '1px solid #bae6fd',
                  color: '#0284c7',
                  '--skeuo-glow': 'rgba(14, 165, 233, 0.3)'
                }}
              >
                <Truck size={26} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.015em',
                    marginBottom: '0.3rem',
                    lineHeight: 1.3
                  }}
                >
                  Pan-India Fast Logistics
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45
                  }}
                >
                  Insured doorstep delivery with live GPS
                </div>
              </div>
            </div>

            {/* 4. Dedicated Concierge */}
            <div
              className="skeuo-card skeuo-card-interactive"
              style={{
                padding: '1.4rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div
                className="skeuo-icon-medallion"
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                  border: '1px solid #e9d5ff',
                  color: '#7e22ce',
                  '--skeuo-glow': 'rgba(168, 85, 247, 0.3)'
                }}
              >
                <PhoneCall size={26} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.015em',
                    marginBottom: '0.3rem',
                    lineHeight: 1.3
                  }}
                >
                  24x7 Dedicated Concierge
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.45
                  }}
                >
                  WhatsApp VIP Support: +91 63952 11953
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Categories Showcase */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="flex justify-between items-end" style={{ marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--primary-600, #166534)',
                  background: 'rgba(22, 101, 52, 0.08)',
                  padding: '0.18rem 0.55rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Sparkles size={11} color="#d4af37" />
                <span>EXPLORE BY DEPARTMENT</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                DIRECT FROM SOURCE
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.015em', margin: 0 }}>
              Popular Categories
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Authentic pure spices, smart gadgets, artisan living, and commercial appliances.
            </p>
          </div>

          <Link
            to="/products"
            className="flex items-center gap-1.5 btn btn-secondary btn-sm"
            style={{
              fontWeight: 700,
              fontSize: '0.825rem',
              borderRadius: '8px',
              padding: '0.45rem 0.95rem'
            }}
          >
            <span>View All Catalog</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
          {(categories.length > 0 ? categories.slice(0, 6) : [
            {
              name: 'Spices & Masale',
              slug: 'spices-masale',
              image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
              startingPrice: '₹45'
            },
            {
              name: 'Electronics & Smart Tech',
              slug: 'electronics-gadgets',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
              startingPrice: '₹799'
            },
            {
              name: 'Home Decor & Living',
              slug: 'home-decor-living',
              image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
              startingPrice: '₹499'
            },
            {
              name: 'Kitchen & Appliances',
              slug: 'kitchen-home-appliances',
              image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80',
              startingPrice: '₹1,299'
            },
            {
              name: 'Hardware & Tools',
              slug: 'hardware-power-tools',
              image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
              startingPrice: '₹999'
            },
            {
              name: 'Organic Groceries & Oils',
              slug: 'organic-groceries-oils',
              image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&q=80',
              startingPrice: '₹85'
            }
          ]).map((cat, idx) => (
            <Link
              key={cat._id || cat.slug || idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="skeuo-card skeuo-card-interactive group"
              style={{
                padding: '1.4rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              <div
                className="skeuo-icon-medallion"
                style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  padding: '0.45rem'
                }}
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80'}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  className="group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  lineHeight: 1.3,
                  marginBottom: '0.35rem',
                  minHeight: '2.2rem'
                }}
              >
                {cat.name}
              </div>

              {cat.startingPrice && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: 'var(--primary-600, #166534)',
                    background: 'rgba(22, 101, 52, 0.08)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px'
                  }}
                >
                  From {cat.startingPrice}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Curated Bestsellers & Trending Products with Category Filter Tabs */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="flex justify-between items-end" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#b38f20',
                  background: 'rgba(212, 175, 55, 0.12)',
                  padding: '0.18rem 0.55rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Award size={12} color="#d4af37" />
                <span>TOP RANKED BESTSELLERS</span>
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.015em', margin: 0 }}>
              Trending Signature Essentials
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Customer favorites backed by verified reviews and direct manufacturer warranty.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Spices', 'Electronics', 'Decor', 'Kitchen'].map((tab) => {
              const isActive = selectedCategoryTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedCategoryTab(tab)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    border: `1px solid ${isActive ? 'var(--primary-600, #166534)' : 'var(--border-color)'}`,
                    background: isActive ? 'var(--primary-600, #166534)' : 'var(--bg-surface)',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab === 'All' ? 'All Bestsellers' : tab}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
            Loading curated products...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {displayedProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 7. "The Eidula Standard" Luxury Brand Story Section */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #051c14 0%, #0d3824 60%, #166534 100%)',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.85rem' }}>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: '#fbeea4',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Sparkles size={11} color="#fbeea4" />
                  <span>THE EIDULA PROMISE</span>
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '0.65rem' }}>
                Rooted in Heritage Purity. <br />
                <span style={{ color: '#fbeea4' }}>Engineered for Modern Living.</span>
              </h2>

              <p style={{ color: '#dcfce7', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '1.25rem', maxWidth: '520px' }}>
                From high-curcumin Lakadong turmeric and Grade-1 Kashmiri saffron to noise-cancelling acoustics and commercial-grade 1000W copper motors — every product on Eidula undergoes stringent multi-stage quality verification before it reaches your doorstep.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '1.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbeea4' }}>50,000+</div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Orders Fulfilled Pan-India</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbeea4' }}>100% Purity</div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>Lab-Tested Food Grade</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbeea4' }}>GST Input</div>
                  <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>100% Tax Compliant B2B</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="btn btn-gold"
                  style={{
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.85rem',
                    borderRadius: '10px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight size={15} />
                </Link>

                <a
                  href="https://wa.me/916395211953?text=Hello%20Eidula%20Concierge,%20I%20have%20an%20order%20inquiry"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.85rem',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff'
                  }}
                >
                  <PhoneCall size={15} />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Right Visual Image */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '460px',
                  height: '320px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  position: 'relative'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=85"
                  alt="Eidula Purity & Quality"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '15px',
                    right: '15px',
                    background: 'rgba(5, 28, 20, 0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbeea4' }}>Eidula Assurance Shield</div>
                    <div style={{ fontSize: '0.68rem', color: '#a7f3d0' }}>Batch Tested • Tamper Evident Packing</div>
                  </div>
                  <CheckCircle2 size={18} color="#34d399" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Verified Customer Testimonials & Social Proof */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="flex justify-between items-end" style={{ marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#166534',
                  background: 'rgba(22, 101, 52, 0.08)',
                  padding: '0.18rem 0.55rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Star size={11} color="#f59e0b" fill="#f59e0b" />
                <span>CUSTOMER REVIEWS</span>
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.015em', margin: 0 }}>
              Loved by 45,000+ Verified Buyers
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
              Read genuine feedback from verified homeowners, chefs, and commercial buyers across India.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="hover:shadow-md transition-shadow"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1" style={{ marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />
                  ))}
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                  "{t.title}"
                </h4>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {t.comment}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {t.location} • Verified Buyer
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.68rem',
                    color: '#16a34a',
                    fontWeight: 700,
                    background: 'rgba(22, 163, 74, 0.08)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  ✓ Verified Order
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Recently Viewed Products Section */}
      <RecentlyViewed
        title="Recently Viewed Products"
        subtitle="Pick up right where you left off - quick access to items you recently explored"
        limit={8}
      />

      {/* 10. Direct Manufacturer Storefronts */}
      <BrandStorefrontSection />

      {/* 11. Eidula Privé VIP Membership / Newsletter Banner */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #020d08 0%, #072617 100%)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            padding: '2.5rem',
            color: '#ffffff',
            boxShadow: 'var(--shadow-luxury)'
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.4rem' }}>
                <span
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: '#fbeea4',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    letterSpacing: '0.05em'
                  }}
                >
                  VIP PRIVÉ CLUB
                </span>
                <span style={{ fontSize: '0.75rem', color: '#86efac' }}>Instant ₹250 Welcome Voucher</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: '0.2rem 0 0.4rem 0' }}>
                Join the Eidula Privé Circle
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', maxWidth: '540px', lineHeight: 1.5, margin: 0 }}>
                Get early VIP access to flash drops, festive hampers, and secret coupons. Use promo code <strong style={{ color: '#fbeea4' }}>WELCOME250</strong> at checkout for ₹250 off on orders over ₹999.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/products?category=Spices+%26+Masale"
                className="btn btn-gold btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.5rem 1rem', textDecoration: 'none' }}
              >
                Claim Spices Voucher
              </Link>
              <Link
                to="/products?category=Electronics+%26+Smart+Tech"
                className="btn btn-luxury btn-sm"
                style={{ fontSize: '0.78rem', padding: '0.5rem 1rem', textDecoration: 'none' }}
              >
                Shop Smart Tech
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
