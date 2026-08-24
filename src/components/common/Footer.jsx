import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, ShieldCheck, Truck, CreditCard, Headphones, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#051b11', color: '#94a3b8', borderTop: '4px solid #166534', marginTop: '4rem' }}>
      {/* Guarantees Ribbon */}
      <div style={{ background: '#082819', padding: '2rem 0', borderBottom: '1px solid #14532d' }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <ShieldCheck size={28} color="#22c55e" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>100% Genuine Machinery</div>
              <div style={{ fontSize: '0.8rem' }}>Direct OEM manufacturer warranty</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <CreditCard size={28} color="#f59e0b" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Easy Kisan EMI</div>
              <div style={{ fontSize: '0.8rem' }}>Flexible 3 to 36 months tenures</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <Truck size={28} color="#38bdf8" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Pan-India Farm Delivery</div>
              <div style={{ fontSize: '0.8rem' }}>Secure heavy machinery transport</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
              <Headphones size={28} color="#a855f7" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>Agronomy Expert Advisory</div>
              <div style={{ fontSize: '0.8rem' }}>Field support & machinery guides</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '3.5rem 0' }}>
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div style={{ background: '#166534', padding: '0.4rem', borderRadius: '8px' }}>
                <Tractor size={22} color="#86efac" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                AGRI<span style={{ color: '#22c55e' }}>MACHINA</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              India's trusted commercial agricultural machinery marketplace. Empowering farmers with modern mechanization, genuine OEM parts, and affordable financing.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div>📞 Kisan Helpline: 1800-AGRI-FARM</div>
              <div>💬 WhatsApp Support: +91 90277 99171</div>
            </div>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Machinery Categories</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/products?category=Power+Weeders" className="hover:text-white">Power Weeders & Tillers</Link></li>
              <li><Link to="/products?category=Water+Pumps+%26+Solar+Irrigation" className="hover:text-white">Solar Submersible Pumps</Link></li>
              <li><Link to="/products?category=Rotavators+%26+Tillers" className="hover:text-white">Tractor Rotavators</Link></li>
              <li><Link to="/products?category=Brush+Cutters+%26+Harvesters" className="hover:text-white">Commercial Brush Cutters</Link></li>
              <li><Link to="/products?category=Agricultural+Sprayers" className="hover:text-white">Battery & Engine Sprayers</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Ideal Farm Solutions</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/products?idealFor=Vegetable+Farming" className="hover:text-white">Vegetable & Horticulture Farms</Link></li>
              <li><Link to="/products?idealFor=Orchards" className="hover:text-white">Fruit Orchards & Vineyards</Link></li>
              <li><Link to="/products?idealFor=Sugarcane" className="hover:text-white">Sugarcane Inter-Cultivation</Link></li>
              <li><Link to="/products?idealFor=Cotton" className="hover:text-white">Cotton Crop Mechanization</Link></li>
              <li><Link to="/products?idealFor=Small+Farms" className="hover:text-white">Small & Marginal Farm Kits</Link></li>
            </ul>
          </div>

          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Kisan Finance & Services</div>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              We partner with leading agricultural banks including SBI Kisan Credit, HDFC Agri Finance, and Bajaj Finserv to provide subsidized low-interest equipment loans.
            </p>
            <div className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              GST Invoicing & Input Tax Credit
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #14532d', padding: '1.25rem 0', fontSize: '0.8rem', textAlign: 'center' }}>
        <div className="container">
          © {new Date().getFullYear()} AgriMachina India Commercial Platform. All Rights Reserved. Built for Indian Agriculture.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
