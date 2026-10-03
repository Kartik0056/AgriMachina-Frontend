import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  User,
  Sun,
  MessageSquare,
  Heart,
  PhoneCall,
  Menu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import CategoryIcon from '../CategoryIcon';
import EidulaLogo from '../EidulaLogo';

const MobileDrawer = ({
  mobileDrawerOpen,
  setMobileDrawerOpen,
  isAuthenticated,
  user,
  logout,
  unreadSupportCount,
  wishlistCount,
  mobileCategoriesOpen,
  setMobileCategoriesOpen,
  categoriesList,
  THEMES,
  theme,
  setTheme
}) => {
  if (!mobileDrawerOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex' }}>
      <div
        onClick={() => setMobileDrawerOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out forwards'
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '320px',
          maxWidth: '85vw',
          height: '100%',
          background: 'var(--bg-surface, #ffffff)',
          color: 'var(--text-main, #0f172a)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 1000000,
          boxShadow: '6px 0 30px rgba(0,0,0,0.35)',
          overflowY: 'auto'
        }}
      >
        <div>
          <div style={{ padding: '1.15rem 1.25rem', background: 'linear-gradient(135deg, #052e16, #14532d)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <EidulaLogo size="sm" light={true} />

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '0.85rem 1.25rem', background: 'var(--bg-surface-alt, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#166534', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.phone || user?.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    logout();
                  }}
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileDrawerOpen(false)}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}
              >
                <User size={15} />
                <span>Customer Sign In / Register</span>
              </Link>
            )}
          </div>

          <div style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.5rem' }}>
              Quick Navigation
            </div>

            <Link
              to="/products"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <span>🛍️</span>
              <span>All Products Catalog</span>
            </Link>

            <Link
              to="/products?category=Spices+%26+Masale"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <span>🌶️</span>
              <span>Pure Spices & Masale</span>
            </Link>

            <Link
              to="/products?category=Electronics+%26+Smart+Tech"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <span>⚡</span>
              <span>Electronics & Smart Tech</span>
            </Link>

            <Link
              to="/products?category=Home+Decor+%26+Living"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <span>🏺</span>
              <span>Home Decor & Living</span>
            </Link>

            <Link
              to="/support"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare size={17} color="#166534" />
                <span>Support Messages & Advisory</span>
              </div>
              {unreadSupportCount > 0 && (
                <span className="badge" style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, borderRadius: '999px', padding: '0.15rem 0.45rem' }}>
                  {unreadSupportCount} NEW
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <Heart size={17} color="#dc2626" />
                <span>Saved Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 800 }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileDrawerOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:bg-green-50 dark:hover:bg-slate-800"
            >
              <PhoneCall size={17} color="#166534" />
              <span>Helpline & FAQs</span>
            </Link>

            <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-alt, #f1f5f9)', border: '1px solid var(--border-color, #cbd5e1)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-2">
                  <Menu size={16} color="#166534" />
                  <span>Browse All Categories</span>
                </div>
                <ChevronDown size={16} style={{ transform: mobileCategoriesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {mobileCategoriesOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
                  {categoriesList.map((cat) => (
                    <Link
                      key={cat.id || cat._id}
                      to={`/products?category=${encodeURIComponent(cat.param || cat.name)}`}
                      onClick={() => setMobileDrawerOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}
                      className="hover:bg-green-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon icon={cat.icon} size={16} color="#166534" />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight size={13} color="#94a3b8" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface-alt, #f8fafc)', borderTop: '1px solid var(--border-color, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href="tel:6395211953"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#166534', color: '#ffffff', padding: '0.65rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}
          >
            <PhoneCall size={16} color="#86efac" />
            <span>+91 63952 11953 (Customer Support)</span>
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Storefront Theme:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
              {THEMES.map((thm) => {
                const isCur = theme === thm.id;
                return (
                  <button
                    key={thm.id}
                    type="button"
                    onClick={() => setTheme(thm.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      border: isCur ? `2px solid ${thm.primaryColor}` : '1px solid var(--border-color, #cbd5e1)',
                      background: isCur ? 'var(--primary-50, rgba(22, 101, 52, 0.15))' : 'var(--bg-surface, #ffffff)',
                      color: isCur ? 'var(--primary-600, #166534)' : 'var(--text-main, #0f172a)',
                      fontSize: '0.75rem',
                      fontWeight: isCur ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{thm.icon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thm.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Active: <strong style={{ color: 'var(--text-main)' }}>{THEMES.find((t) => t.id === theme)?.name}</strong>
            </span>

            <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
              SMAM Approved ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
