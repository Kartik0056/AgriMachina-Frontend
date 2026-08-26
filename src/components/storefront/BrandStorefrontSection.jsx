import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Award, CheckCircle2 } from 'lucide-react';

const brandsData = [
  {
    name: 'AgriPro Master',
    tag: 'Flagship Power Weeders & Tillers',
    origin: 'India',
    warranty: '2 Years Comprehensive',
    image: '/images/machinery/power_weeder.jpg',
    modelsCount: 14,
    link: '/products?brand=AgriPro+Master'
  },
  {
    name: 'SunAgro Tech',
    tag: 'Solar Submersible Pumps & MPPT',
    origin: 'India',
    warranty: '5 Years Panel Warranty',
    image: '/images/machinery/solar_pump.jpg',
    modelsCount: 9,
    link: '/products?brand=SunAgro+Tech'
  },
  {
    name: 'Shaktiman FarmTech',
    tag: 'Heavy Tractor Rotavators & Ploughs',
    origin: 'India',
    warranty: '1 Year Field Warranty',
    image: '/images/machinery/rotavator.jpg',
    modelsCount: 18,
    link: '/products?brand=Shaktiman+FarmTech'
  },
  {
    name: 'Honda Agro Power',
    tag: '4-Stroke Engine Multi-Crop Cutters',
    origin: 'Japan',
    warranty: '2 Years Engine Guarantee',
    image: '/images/machinery/brush_cutter.jpg',
    modelsCount: 11,
    link: '/products?brand=Honda+Agro+Power'
  },
  {
    name: 'KisanKraft',
    tag: 'Knapsack Sprayers & Garden Tools',
    origin: 'India',
    warranty: '1 Year Warranty',
    image: '/images/machinery/sprayer.jpg',
    modelsCount: 22,
    link: '/products?brand=KisanKrafts'
  }
];

const BrandStorefrontSection = () => {
  return (
    <section className="container" style={{ marginBottom: '4rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
            <Award size={18} color="#166534" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Direct Manufacturer Storefronts
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)' }}>Authorized Agricultural Machinery Brands</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Direct manufacturer warranties, 100% genuine spares, and verified factory pricing
          </p>
        </div>

        <Link to="/products" className="flex items-center gap-1" style={{ color: '#166534', fontWeight: 700, fontSize: '0.9rem' }}>
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

              <div className="flex items-center gap-1" style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, marginBottom: '0.2rem' }}>
                <ShieldCheck size={13} color="#166534" />
                <span>Verified OEM</span>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {brand.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                {brand.tag}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ color: '#166534', fontWeight: 700 }}>{brand.modelsCount}+ Models</span>
              <span style={{ color: 'var(--text-light)' }}>{brand.warranty}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BrandStorefrontSection;
