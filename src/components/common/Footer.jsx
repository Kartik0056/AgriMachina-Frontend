import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Headphones } from 'lucide-react';
import SiddhivaLogo from './SiddhivaLogo';

const Footer = () => {
  return (
    <footer style={{ background: '#051b11', color: 'var(--text-light)', borderTop: '4px solid #166534', marginTop: '4rem' }}>
      {/* Guarantees Ribbon */}
      <div style={{ background: '#082819', padding: '2rem 0', borderBottom: '1px solid #14532d' }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <ShieldCheck size={28} color="#22c55e" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>100% Genuine Products</div>
              <div style={{ fontSize: '0.8rem' }}>Direct manufacturer warranty</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <CreditCard size={28} color="#f59e0b" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Easy No-Cost EMI</div>
              <div style={{ fontSize: '0.8rem' }}>Flexible 3 to 36 months tenures</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <Truck size={28} color="#38bdf8" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Pan-India Fast Delivery</div>
              <div style={{ fontSize: '0.8rem' }}>Doorstep delivery with live tracking</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <Headphones size={28} color="#a855f7" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>24x7 Customer Support</div>
              <div style={{ fontSize: '0.8rem' }}>Call, WhatsApp, & email advisory</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '3.5rem 0' }}>
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <SiddhivaLogo size="md" light={true} />
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Siddhiva is India's premier multi-category online store and commercial marketplace. Providing top-quality equipment, tools, home essentials, electronics, and smart machinery with transparent pricing and verified warranties.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>📞 Helpline: <a href="tel:6395211953" style={{ color: '#86efac', textDecoration: 'none' }}>+91 63952 11953</a></div>
              <div>💬 WhatsApp: <a href="https://wa.me/916395211953" target="_blank" rel="noreferrer" style={{ color: '#86efac', textDecoration: 'none' }}>+91 63952 11953</a></div>
              <div>✉️ Email: <a href="mailto:kartikkumar151998@gmail.com" style={{ color: '#86efac', textDecoration: 'none' }}>kartikkumar151998@gmail.com</a></div>
            </div>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Popular Categories</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/products?category=Power+Weeders" className="hover:text-white">Power Weeders & Tillers</Link></li>
              <li><Link to="/products?category=Water+Pumps+%26+Solar+Irrigation" className="hover:text-white">Water & Solar Pumps</Link></li>
              <li><Link to="/products?category=Rotavators+%26+Tillers" className="hover:text-white">Tillers & Rotavators</Link></li>
              <li><Link to="/products?category=Brush+Cutters+%26+Harvesters" className="hover:text-white">Commercial Brush Cutters</Link></li>
              <li><Link to="/products?category=Agricultural+Sprayers" className="hover:text-white">Battery & Engine Sprayers</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Solutions & Applications</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/products?idealFor=Vegetable+Farming" className="hover:text-white">Gardening & Horticulture</Link></li>
              <li><Link to="/products?idealFor=Orchards" className="hover:text-white">Orchards & Plantations</Link></li>
              <li><Link to="/products?idealFor=Sugarcane" className="hover:text-white">Commercial Farming</Link></li>
              <li><Link to="/products?idealFor=Small+Farms" className="hover:text-white">Home & Workshop Kits</Link></li>
              <li><Link to="/products" className="hover:text-white">Explore All Catalog</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Customer Services & Financing</div>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              We offer seamless payment options including UPI, Net Banking, Credit/Debit cards, and 0% No-Cost EMI through leading banks and Razorpay.
            </p>
            <div className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              GST Invoicing & Safe Delivery Guaranteed
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #14532d', padding: '1.25rem 0', fontSize: '0.8rem', textAlign: 'center' }}>
        <div className="container">
          © {new Date().getFullYear()} Siddhiva Commerce Platform. All Rights Reserved. Built for Consumers and Businesses.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
