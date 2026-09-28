import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  MessageSquare,
  ChevronDown
} from 'lucide-react';

const UserDropdown = ({
  user,
  logout,
  t,
  wishlistCount,
  unreadSupportCount,
  userDropdownOpen,
  setUserDropdownOpen
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        className="flex items-center gap-1"
        style={{
          background: 'transparent',
          border: 'none',
          padding: '0.2rem',
          cursor: 'pointer',
          borderRadius: '50%'
        }}
        title={user?.name || 'My Farmer Account'}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #16a34a',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          />
        ) : (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #125435, #16a34a)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.95rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
          </div>
        )}
        <ChevronDown size={13} color="#475569" style={{ marginLeft: '2px' }} />
      </button>

      {userDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '105%',
            width: '220px',
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-color)',
            padding: '0.5rem',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
          onMouseLeave={() => setUserDropdownOpen(false)}
        >
          <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#166534', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'F'}
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>

          <Link
            to="/profile"
            onClick={() => setUserDropdownOpen(false)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <User size={15} color="#166534" />
            <span>{t('my_profile', 'My Profile')}</span>
          </Link>

          <Link
            to="/orders"
            onClick={() => setUserDropdownOpen(false)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-main, #0f172a)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <Package size={15} color="#166534" />
            <span>{t('my_orders', 'My Orders & Invoices')}</span>
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setUserDropdownOpen(false)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-main, #0f172a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div className="flex items-center gap-2">
              <Heart size={15} color="#dc2626" />
              <span>{t('saved_wishlist', 'Saved Wishlist')}</span>
            </div>
            {wishlistCount > 0 && (
              <span className="badge" style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', fontWeight: 800 }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/support"
            onClick={() => setUserDropdownOpen(false)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-main, #0f172a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={15} color="#166534" />
              <span>{t('support_messages', 'Support Messages')}</span>
            </div>
            {unreadSupportCount > 0 && (
              <span className="badge badge-accent" style={{ fontSize: '0.65rem', background: '#dc2626', color: '#ffffff' }}>
                {unreadSupportCount}
              </span>
            )}
          </Link>

          <div style={{ borderTop: '1px solid var(--border-color, #f1f5f9)', paddingTop: '0.25rem' }}>
            <button
              type="button"
              onClick={() => {
                setUserDropdownOpen(false);
                logout();
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                background: 'none',
                border: 'none',
                color: '#dc2626',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
            >
              {t('logout', 'Logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
