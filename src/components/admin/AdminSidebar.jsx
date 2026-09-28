import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
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
import SiddhivaLogo from '../common/SiddhivaLogo';

const AdminSidebar = ({ isMobileOpen, closeMobileSidebar, pendingReviewsCount = 0, openSupportCount = 0 }) => {
  const { hasPermission, adminPanelPath } = useAdminAuth();

  const navItems = [
    { to: `${adminPanelPath}/dashboard`, label: 'Overview Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: `${adminPanelPath}/products`, label: 'Products & Catalog', icon: <Layers size={18} />, perm: 'PRODUCT_CREATE' },
    { to: `${adminPanelPath}/categories`, label: 'Categories & Subcategories', icon: <FolderTree size={18} />, perm: 'CATEGORY_MANAGE' },
    { to: `${adminPanelPath}/products/bulk-import`, label: 'Bulk Excel / CSV Import', icon: <FileSpreadsheet size={18} />, perm: 'PRODUCT_CREATE' },
    { to: `${adminPanelPath}/inventory`, label: 'Inventory & Alerts', icon: <Layers size={18} />, perm: 'INVENTORY_MANAGE' },
    { to: `${adminPanelPath}/orders`, label: 'Orders & Fulfillment', icon: <ShoppingBag size={18} />, perm: 'ORDER_VIEW' },
    { to: `${adminPanelPath}/support`, label: 'Customer Support Desk', icon: <MessageSquare size={18} />, perm: 'SUPPORT_MANAGE', badge: openSupportCount },
    { to: `${adminPanelPath}/banners`, label: 'Hero Banners & Slides', icon: <Layers size={18} />, perm: 'BANNER_MANAGE' },
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
      <div style={{ padding: '1.15rem 1.25rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SiddhivaLogo size="sm" light={true} />
        {isMobileOpen && (
          <button
            type="button"
            onClick={closeMobileSidebar}
            style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        )}
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
