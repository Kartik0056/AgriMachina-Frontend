import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminTopBar = () => {
  const { admin, logout, adminPanelPath } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(`${adminPanelPath}/login`);
  };

  return (
    <header className="admin-topbar">
      {/* Search Input in Topbar */}
      <div style={{ position: 'relative', width: '320px' }}>
        <input
          type="text"
          placeholder="Search products, orders, SKU, audits..."
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--bg-dark-border)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem 0.45rem 2.2rem',
            color: '#ffffff',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-4">
        {/* Storefront Link */}
        <Link
          to="/"
          target="_blank"
          style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.05)'
          }}
          className="hover:text-white"
        >
          <span>Live Storefront</span>
          <ExternalLink size={13} />
        </Link>

        {/* Security Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <ShieldCheck size={14} />
          <span>RBAC Protected</span>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3" style={{ borderLeft: '1px solid var(--bg-dark-border)', paddingLeft: '1rem' }}>
          <div className="flex items-center gap-2">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#166534',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem'
            }}>
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ color: '#ffffff', fontWeight: 600 }}>{admin?.username || 'admin'}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{admin?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Secure Admin Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.4rem',
              borderRadius: '6px'
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
