import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Headphones, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import EidulaLogo from './EidulaLogo';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #051c14 0%, #03120d 100%)',
        color: '#94a3b8',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        marginTop: '4rem'
      }}
    >
      {/* Luxury Guarantees Ribbon */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '2rem 0'
        }}
      >
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '0.75rem',
                borderRadius: '12px',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={24} color="#34d399" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>100% Genuine Quality</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Direct brand warranty & certified purity</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '0.75rem',
                borderRadius: '12px',
                flexShrink: 0
              }}
            >
              <CreditCard size={24} color="#fbeea4" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>0% No-Cost EMI</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Powered by Razorpay & leading banks</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '0.75rem',
                borderRadius: '12px',
                flexShrink: 0
              }}
            >
              <Truck size={24} color="#38bdf8" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>Insured Fast Delivery</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Safe doorstep transport with live tracking</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                padding: '0.75rem',
                borderRadius: '12px',
                flexShrink: 0
              }}
            >
              <Headphones size={24} color="#c084fc" />
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9rem' }}>24x7 VIP Concierge</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>WhatsApp advisory & phone assistance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '3.5rem 0' }}>
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <EidulaLogo size="md" light={true} />
            </div>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '1.25rem' }}>
              Eidula is India's premier lifestyle & pure spices marketplace. Offering authentic handcrafted masale, smart electronics, artisan home decor, and high-performance appliances with 100% verified quality and transparent pricing.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#86efac', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div>📞 Helpline: <a href="tel:6395211953" style={{ color: '#86efac', textDecoration: 'none', fontWeight: 700 }}>+91 63952 11953</a></div>
              <div>💬 WhatsApp VIP: <a href="https://wa.me/916395211953" target="_blank" rel="noreferrer" style={{ color: '#86efac', textDecoration: 'none', fontWeight: 700 }}>+91 63952 11953</a></div>
              <div>✉️ Official: <a href="mailto:kartikkumar151998@gmail.com" style={{ color: '#cbd5e1', textDecoration: 'none' }}>kartikkumar151998@gmail.com</a></div>
            </div>
          </div>

          {/* Popular Departments */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.925rem', marginBottom: '1.15rem', letterSpacing: '0.02em' }}>
              Curated Departments
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem' }}>
              <li><Link to="/products?category=Spices+%26+Masale" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Pure Spices & Whole Masale</Link></li>
              <li><Link to="/products?category=Electronics+%26+Smart+Tech" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Smart Electronics & Audio</Link></li>
              <li><Link to="/products?category=Home+Decor+%26+Living" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Luxury Home Decor & Lighting</Link></li>
              <li><Link to="/products?category=Kitchen+%26+Home+Appliances" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Kitchenware & Appliances</Link></li>
              <li><Link to="/products?category=Hardware+%26+Power+Tools" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Hardware & DIY Tool Kits</Link></li>
              <li><Link to="/products?category=Organic+Groceries+%26+Oils" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Organic Cold-Pressed Oils</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.925rem', marginBottom: '1.15rem', letterSpacing: '0.02em' }}>
              Customer Experience
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem' }}>
              <li><Link to="/user/orders" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Track Live Order Status</Link></li>
              <li><Link to="/contact" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Customer Support & FAQs</Link></li>
              <li><Link to="/products?dealsOnly=true" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Flash Deals & Special Drops</Link></li>
              <li><Link to="/wishlist" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Saved Wishlist</Link></li>
              <li><Link to="/cart" style={{ color: '#cbd5e1', textDecoration: 'none' }} className="hover:text-emerald-400">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Trust, Payments & Invoicing */}
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.925rem', marginBottom: '1.15rem', letterSpacing: '0.02em' }}>
              Financing & Commercial Tax
            </div>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.5, color: '#cbd5e1', marginBottom: '1rem' }}>
              Seamless checkout with UPI, Debit/Credit cards, Net Banking, and 0% No-Cost EMI via Razorpay & leading Indian banks.
            </p>

            <div
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.74rem',
                color: '#fbeea4',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Sparkles size={14} color="#d4af37" />
              <span>Official GST Tax Invoices for B2B Input Credit</span>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              CIN: U72900UP2026PTC198421 • GSTIN: 07AABCY1234F1Z8
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Security Strip */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '1.25rem 0',
          fontSize: '0.76rem',
          color: '#64748b',
          background: 'rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="container flex justify-between items-center flex-wrap gap-3">
          <div>
            © {new Date().getFullYear()} Eidula Lifestyle & Spices Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={13} />
              <span>256-Bit SSL Encrypted Checkout</span>
            </span>
            <span>Made with Excellence in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
