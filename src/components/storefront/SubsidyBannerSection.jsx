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
                🏛️ GOVT. SUBSIDY ASSISTANCE
              </span>
              <span style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 700 }}>
                SMAM & DBT Agriculture Portal Compliant
              </span>
            </div>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.85rem' }}>
              Avail Up to 40% – 50% Subsidy on Agricultural Machinery
            </h2>

            <p style={{ color: '#dcfce7', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
              All our power weeders, solar pumps, and rotavators come with approved test certificates (FMTTI) and official GST invoices required for central and state agriculture mechanization subsidies.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '1.5rem' }}>
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: '#fef08a' }}>
                <CheckCircle2 size={16} color="#86efac" />
                <span>Govt FMTTI Certified</span>
              </div>
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: '#fef08a' }}>
                <CheckCircle2 size={16} color="#86efac" />
                <span>GST Tax Invoice Included</span>
              </div>
              <div className="flex items-center gap-2" style={{ fontSize: '0.825rem', color: '#fef08a' }}>
                <CheckCircle2 size={16} color="#86efac" />
                <span>Free Paperwork Assistance</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/919027799171?text=Hello%20AgriMachina,%20I%20need%20assistance%20with%20Government%20Agricultural%20Machinery%20Subsidy%20application"
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent btn-lg"
              >
                <PhoneCall size={18} />
                <span>Free Subsidy Guidance on WhatsApp</span>
              </a>

              <Link to="/products" className="btn btn-dark btn-lg" style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
                <span>Browse Eligible Machinery</span>
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
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fef08a' }}>₹12.4 Cr+</div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7' }}>Subsidies Claimed by 8,500+ Farmers</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#86efac' }}>28 States</div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7' }}>Pan-India DBT Registration Support</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>100% Online</div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7' }}>Zero-Hassle Direct Account Transfer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidyBannerSection;
