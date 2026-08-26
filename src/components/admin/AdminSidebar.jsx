import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  FileSpreadsheet,
  Layers,
  ShoppingBag,
  Star,
  Tag,
  CreditCard,
  Sparkles,
  Search,
  ShieldAlert,
  Users,
  Settings,
  X,
  MessageSquare
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminSidebar = ({ pendingReviewsCount = 0, pendingOrdersCount = 0 }) => {
  const { admin, hasPermission, adminPanelPath } = useAdminAuth();

  const navItems = [
    { to: `${adminPanelPath}`, label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
    { to: `${adminPanelPath}/products`, label: 'Machinery Catalog', icon: <Tractor size={18} />, perm: 'PRODUCT_CREATE' },
    { to: `${adminPanelPath}/products/bulk-import`, label: 'Bulk Import & Export', icon: <FileSpreadsheet size={18} />, perm: 'PRODUCT_IMPORT' },
    { to: `${adminPanelPath}/inventory`, label: 'Inventory & Stock Logs', icon: <Layers size={18} />, perm: 'INVENTORY_UPDATE' },
    { to: `${adminPanelPath}/orders`, label: 'Orders & Shipments', icon: <ShoppingBag size={18} />, perm: 'ORDER_VIEW', badge: pendingOrdersCount },
    { to: `${adminPanelPath}/support`, label: 'Support & Inquiries Desk', icon: <MessageSquare size={18} /> },
    { to: `${adminPanelPath}/banners`, label: 'Hero Slides & Banners', icon: <Sparkles size={18} />, perm: 'PRODUCT_CREATE' },
    { to: `${adminPanelPath}/reviews`, label: 'Reviews Moderation', icon: <Star size={18} />, perm: 'REVIEW_MODERATE', badge: pendingReviewsCount },
    { to: `${adminPanelPath}/coupons`, label: 'Coupons & Promos', icon: <Tag size={18} />, perm: 'COUPON_MANAGE' },
    { to: `${adminPanelPath}/emi`, label: 'EMI Financing Plans', icon: <CreditCard size={18} />, perm: 'PRODUCT_CREATE' },
    { to: `${adminPanelPath}/recommendations`, label: 'Recommendation Overrides', icon: <Sparkles size={18} />, perm: 'PRODUCT_CREATE' },
    { to: `${adminPanelPath}/seo`, label: 'SEO Management', icon: <Search size={18} />, perm: 'SEO_MANAGE' },
    { to: `${adminPanelPath}/audit-logs`, label: 'Admin Audit Logs', icon: <ShieldAlert size={18} />, perm: 'AUDIT_VIEW' },
    { to: `${adminPanelPath}/users-roles`, label: 'Admins & RBAC Roles', icon: <Users size={18} /> },
    { to: `${adminPanelPath}/settings`, label: 'System Settings', icon: <Settings size={18} /> }
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--admin-accent, #166534)', padding: '0.45rem', borderRadius: '8px' }}>
          <Tractor size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--admin-text-main)', letterSpacing: '-0.02em' }}>
            AGRI<span style={{ color: 'var(--admin-accent)' }}>ADMIN</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Operations CMS
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        {navItems.map((item, idx) => {
          if (item.perm && !hasPermission(item.perm)) return null;

          return (
            <NavLink
              key={idx}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span className="badge badge-accent" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', background: '#f59e0b', color: '#ffffff' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Admin User Footer Badge */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--admin-border)', background: 'var(--admin-bg-card-alt, rgba(0,0,0,0.15))' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
          {admin?.name || 'Administrator'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--admin-accent)', fontWeight: 600 }}>
          {admin?.role || 'SUPER_ADMIN'}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
