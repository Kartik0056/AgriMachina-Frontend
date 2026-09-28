import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  PhoneCall,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import HeroSlider from '../../components/storefront/HeroSlider';
import AmazonQuadCards from '../../components/storefront/AmazonQuadCards';
import LightningDealsSection from '../../components/storefront/LightningDealsSection';
import BrandStorefrontSection from '../../components/storefront/BrandStorefrontSection';
import SubsidyBannerSection from '../../components/storefront/SubsidyBannerSection';
import ProductCard from '../../components/storefront/ProductCard';
import RecentlyViewed from '../../components/storefront/RecentlyViewed';
import api from '../../services/api';
import { useLiveRefresh } from '../../context/SyncContext';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHomeData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=8'),
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

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <HeroSlider />

      <AmazonQuadCards />

      <LightningDealsSection />

      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0', marginBottom: '3.5rem' }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '12px', color: '#166534', flexShrink: 0 }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>100% Genuine Quality</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Products & Brand Warranty</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '12px', color: '#d97706', flexShrink: 0 }}>
              <CreditCard size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>0% No-Cost EMI</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powered by Razorpay & Leading Banks</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px', color: '#0284c7', flexShrink: 0 }}>
              <Truck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>Pan-India Fast Delivery</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safe Doorstep Transport with Tracking</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: '#f3e8ff', padding: '0.75rem', borderRadius: '12px', color: '#9333ea', flexShrink: 0 }}>
              <PhoneCall size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>24x7 Customer Support</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone & WhatsApp: +91 63952 11953</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
              <span
                className="badge"
                style={{
                  background: 'rgba(22, 163, 74, 0.1)',
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
                <Sparkles size={12} />
                <span>EXPLORE BY CATEGORY</span>
              </span>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
                DIRECT FACTORY RATES
              </span>
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--text-main)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Popular Categories
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
              Industrial-grade machinery, solar irrigation, power weeders & workshop equipment
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 btn btn-secondary btn-sm"
            style={{
              fontWeight: 700,
              fontSize: '0.875rem',
              borderRadius: '10px',
              padding: '0.55rem 1rem'
            }}
          >
            <span>View All Catalog</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {(categories.length > 0 ? categories.slice(0, 6) : [
            {
              name: 'Power Weeders',
              slug: 'power-weeders',
              image: '/images/machinery/power_weeder.jpg',
              startingPrice: '₹38,499',
              tagline: 'High Torque'
            },
            {
              name: 'Solar Pumps',
              slug: 'water-pumps-solar-irrigation',
              image: '/images/machinery/solar_pump.jpg',
              startingPrice: '₹18,999',
              tagline: 'Zero Electric Bill'
            },
            {
              name: 'Rotavators & Tillers',
              slug: 'rotavators-tillers',
              image: '/images/machinery/rotavator.jpg',
              startingPrice: '₹24,999',
              tagline: 'Tillage & Beds'
            },
            {
              name: 'Brush Cutters',
              slug: 'brush-cutters-harvesters',
              image: '/images/machinery/brush_cutter.jpg',
              startingPrice: '₹12,499',
              tagline: 'Crop Harvesting'
            },
            {
              name: 'Agricultural Sprayers',
              slug: 'agricultural-sprayers',
              image: '/images/machinery/sprayer.jpg',
              startingPrice: '₹3,499',
              tagline: 'Battery & Manual'
            },
            {
              name: 'Chaff Cutters',
              slug: 'chaff-cutters-threshers',
              image: '/images/machinery/rotavator.jpg',
              startingPrice: '₹19,999',
              tagline: 'Fodder Prep'
            }
          ]).map((cat, idx) => (
            <Link
              key={cat._id || cat.slug || idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="category-showcase-card group"
            >
              <div className="category-img-wrapper">
                <img
                  src={cat.image || '/images/machinery/power_weeder.jpg'}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '0.6rem',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))'
                  }}
                  loading="lazy"
                />
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="category-title" title={cat.name}>
                  {cat.name}
                </div>

                {cat.startingPrice && (
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--primary-600, #16a34a)',
                      background: 'rgba(22, 163, 74, 0.08)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      marginTop: '0.15rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <span>From {cat.startingPrice}</span>
                  </div>
                )}

                <div
                  className="category-subtext"
                  style={{
                    marginTop: '0.4rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span>Explore</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>TOP RANKED</span>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>VERIFIED QUALITY</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>Best Sellers & Trending Products</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>High-performance tools, pumps, and everyday essential machinery in stock</p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-sm">
            <span>Explore All Products</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading products...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Viewed Products Section */}
      <RecentlyViewed
        title="Recently Viewed Products"
        subtitle="Pick up right where you left off - quick access to equipment & tools you recently browsed"
        limit={8}
      />

      <BrandStorefrontSection />

      <SubsidyBannerSection />

      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div style={{ background: 'var(--primary-50)', border: '1px solid #bbf7d0', borderRadius: '24px', padding: '2.5rem' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Siddhiva Smart Solutions</span>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>Tailored Solutions for Home, Workshop, Garden & Commercial Use</h2>
              <p style={{ color: '#166534', fontSize: '0.95rem', maxWidth: '600px', marginTop: '0.5rem' }}>
                Whether you manage residential gardens, home workshop projects, commercial establishments, or expansive farms, discover tailored products on Siddhiva that save time, labor, and costs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/products?idealFor=Vegetable+Farming" className="btn btn-primary btn-sm">Garden & Vegetables</Link>
              <Link to="/products?idealFor=Sugarcane" className="btn btn-primary btn-sm">Commercial Use</Link>
              <Link to="/products?idealFor=Cotton" className="btn btn-primary btn-sm">Power Tools</Link>
              <Link to="/products?idealFor=Paddy" className="btn btn-primary btn-sm">Pumps & Motors</Link>
              <Link to="/products?idealFor=Orchards" className="btn btn-primary btn-sm">Orchards & Landscaping</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
