import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Award,
  Zap,
  Layers
} from 'lucide-react';
import HeroSlider from '../../components/storefront/HeroSlider';
import AmazonQuadCards from '../../components/storefront/AmazonQuadCards';
import LightningDealsSection from '../../components/storefront/LightningDealsSection';
import BrandStorefrontSection from '../../components/storefront/BrandStorefrontSection';
import SubsidyBannerSection from '../../components/storefront/SubsidyBannerSection';
import ProductCard from '../../components/storefront/ProductCard';
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

  // Real-time live synchronization without manual refresh
  useLiveRefresh(loadHomeData, ['CATALOG_CHANGED', 'INVENTORY_UPDATED', 'CATEGORY_CHANGED', 'DEALS_UPDATED']);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      {/* 1. Dynamic Hero Machinery Slider with Layered Details */}
      <HeroSlider />

      {/* 2. Amazon-Style 4-Quadrant Feature Cards Grid */}
      <AmazonQuadCards />

      {/* 3. Today's Lightning Deals / Deal of the Day */}
      <LightningDealsSection />

      {/* 4. Key Trust & Services Bar */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0', marginBottom: '3.5rem' }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '12px', color: '#166534', flexShrink: 0 }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>100% Genuine OEM Warranty</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Authorized Factory Direct Machinery</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '12px', color: '#d97706', flexShrink: 0 }}>
              <CreditCard size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>0% No-Cost Kisan EMI</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Powered by Razorpay & Leading Banks</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px', color: '#0284c7', flexShrink: 0 }}>
              <Truck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Pan-India Farm Gate Delivery</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Safe Palletized Transport to Village</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: '#f3e8ff', padding: '0.75rem', borderRadius: '12px', color: '#9333ea', flexShrink: 0 }}>
              <PhoneCall size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>Agronomy Field Advice</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Free WhatsApp / Phone Consultation</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Equipment Categories */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', color: '#062416' }}>Popular Equipment Categories</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Select machinery tailored for your crops and land area</p>
          </div>
          <Link to="/products" className="flex items-center gap-1" style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>View All Catalog</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {(categories.length > 0 ? categories : [
            { name: 'Power Weeders', slug: 'power-weeders', image: '/images/machinery/power_weeder.jpg' },
            { name: 'Solar Pumps', slug: 'water-pumps-solar-irrigation', image: '/images/machinery/solar_pump.jpg' },
            { name: 'Rotavators', slug: 'rotavators-tillers', image: '/images/machinery/rotavator.jpg' },
            { name: 'Brush Cutters', slug: 'brush-cutters-harvesters', image: '/images/machinery/brush_cutter.jpg' },
            { name: 'Sprayers', slug: 'agricultural-sprayers', image: '/images/machinery/sprayer.jpg' },
            { name: 'Chaff Cutters', slug: 'chaff-cutters-threshers', image: '/images/machinery/rotavator.jpg' }
          ]).map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '0.85rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-sm)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ width: '100%', height: '100px', background: '#f8fafc', borderRadius: '10px', overflow: 'hidden' }}>
                <img
                  src={cat.image || '/images/machinery/power_weeder.jpg'}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.4rem' }}
                />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Best Sellers in Agricultural Mechanization */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>TOP RANKED</span>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>VERIFIED QUALITY</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#062416' }}>Best Sellers in Agricultural Mechanization</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>High-performance cultivators, solar pumps, and crop harvesters in stock</p>
          </div>
          <Link to="/products" className="btn btn-secondary btn-sm">
            <span>Explore All Products</span>
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading farm machinery...</div>
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

      {/* 7. Top OEM Manufacturer Brands Storefronts */}
      <BrandStorefrontSection />

      {/* 8. Government Subsidy & KCC Advisory */}
      <SubsidyBannerSection />

      {/* 9. Farm Solutions By Crop Type */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '24px', padding: '2.5rem' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Machinery By Crop</span>
              <h2 style={{ fontSize: '1.75rem', color: '#062416' }}>Mechanization Solutions for Every Crop</h2>
              <p style={{ color: '#166534', fontSize: '0.95rem', maxWidth: '600px', marginTop: '0.5rem' }}>
                Whether you cultivate Cotton, Sugarcane, Paddy, Wheat, Vegetables, or Horticulture Orchards, discover tailored machinery that reduces labor costs by up to 60%.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/products?idealFor=Vegetable+Farming" className="btn btn-primary btn-sm">Vegetables</Link>
              <Link to="/products?idealFor=Sugarcane" className="btn btn-primary btn-sm">Sugarcane</Link>
              <Link to="/products?idealFor=Cotton" className="btn btn-primary btn-sm">Cotton</Link>
              <Link to="/products?idealFor=Paddy" className="btn btn-primary btn-sm">Paddy & Wheat</Link>
              <Link to="/products?idealFor=Orchards" className="btn btn-primary btn-sm">Fruit Orchards</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
