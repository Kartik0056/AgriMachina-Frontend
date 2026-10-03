import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, PhoneCall, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

const SubsidyBannerSection = () => {
  return (
    <section className="container" style={{ marginBottom: '4.5rem' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #062416, #14532d)',
          color: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              <span className="badge" style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 800, fontSize: '0.75rem' }}>
                🌟 MEGA SAVINGS & ASSURED PURITY
              </span>
              <span style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 700 }}>
                100% Certified Authentic Brands & Farm-Fresh Spices
              </span>
            </div>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.85rem' }}>
              Save Big on Pure Spices, Smart Electronics & Home Essentials
            </h2>

            <p style={{ color: '#dcfce7', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              Discover our curated range of authentic whole & ground spices, cutting-edge smart gadgets, handcrafted home decor, and high-performance appliances with verified brand warranties and 0% No-Cost EMI.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '1.5rem' }}>
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: '#fef08a' }}>
                <CheckCircle2 size={16} color="#86efac" />
                <span>100% Lab Tested & Pure</span>
              </div>
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: '#fef08a' }}>
                <CheckCircle2 size={16} color="#86efac" />
                <span>Official GST Tax Invoice</span>
              </div>
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: '#fef08a' }}>
                <CheckCircle2 size={16} color="#86efac" />
                <span>Fast Doorstep Delivery</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/916395211953?text=Hello%20Eidula,%20I%20need%20product%20and%20order%20assistance"
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent btn-lg"
              >
                <PhoneCall size={18} />
                <span>Order on WhatsApp Support</span>
              </a>

              <Link to="/products" className="btn btn-dark btn-lg" style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
                <span>Explore All Categories</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fef08a' }}>50,000+</div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7' }}>Delighted Customers Nationwide</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#86efac' }}>28 States</div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7' }}>Express Pan-India Doorstep Delivery</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>4.9 ★ Rating</div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7' }}>Verified Authentic Product Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidyBannerSection;
