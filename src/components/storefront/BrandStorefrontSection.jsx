import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Award, CheckCircle2 } from 'lucide-react';

const brandsData = [
  {
    name: 'Everest Spices',
    tag: 'Pure Whole & Ground Masale',
    origin: 'India',
    warranty: '100% Purity Certified',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',
    modelsCount: 24,
    link: '/products?category=Spices+%26+Masale'
  },
  {
    name: 'Philips',
    tag: 'Smart Lighting & Audio Electronics',
    origin: 'Netherlands',
    warranty: '2 Years Comprehensive',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    modelsCount: 16,
    link: '/products?category=Electronics+%26+Smart+Tech'
  },
  {
    name: 'Urban Bloom',
    tag: 'Artisan Ceramics & Home Decor',
    origin: 'India',
    warranty: 'Handcrafted Quality',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
    modelsCount: 19,
    link: '/products?category=Home+Decor+%26+Living'
  },
  {
    name: 'Havells',
    tag: 'Kitchen Appliances & Fast Tech',
    origin: 'India',
    warranty: '5 Years Motor Warranty',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80',
    modelsCount: 18,
    link: '/products?category=Kitchen+%26+Home+Appliances'
  },
  {
    name: 'Bosch Professional',
    tag: 'Cordless Power Tools & DIY Hardware',
    origin: 'Germany',
    warranty: '1 Year Heavy Warranty',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
    modelsCount: 22,
    link: '/products?category=Hardware+%26+Power+Tools'
  }
];

const BrandStorefrontSection = () => {
  return (
    <section className="container" style={{ marginBottom: '4rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
            <Award size={18} color="var(--primary-600, #166534)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Direct Manufacturer Storefronts
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>Featured Authentic Brands</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Direct brand warranties, certified authenticity, and transparent factory-direct pricing
          </p>
        </div>

        <Link to="/products" className="flex items-center gap-1" style={{ color: 'var(--primary-600, #166534)', fontWeight: 700, fontSize: '0.9rem' }}>
          <span>View All Brands</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {brandsData.map((brand, idx) => (
          <Link
            key={idx}
            to={brand.link}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <div>
              <div style={{ width: '100%', height: '120px', background: 'var(--bg-surface-alt)', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
                <img
                  src={brand.image}
                  alt={brand.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div className="flex items-center gap-1" style={{ fontSize: '0.7rem', color: 'var(--primary-600, #166534)', fontWeight: 700, marginBottom: '0.2rem' }}>
                <ShieldCheck size={13} color="var(--primary-600, #166534)" />
                <span>Verified OEM</span>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {brand.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                {brand.tag}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color, #f1f5f9)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--primary-600, #166534)', fontWeight: 700 }}>{brand.modelsCount}+ Models</span>
              <span style={{ color: 'var(--text-light)' }}>{brand.warranty}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BrandStorefrontSection;
