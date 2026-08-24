import React from 'react';
import { Settings, ShieldCheck, Lock, DollarSign, Database, Server } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminSettingsPage = () => {
  const { adminPanelPath } = useAdminAuth();

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div>
        <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
          System Configuration & Commercial Settings
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Global parameters for agricultural tax rules, secret portal route, and system security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & Secret Portal Path Card */}
        <div className="admin-card">
          <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
            <ShieldCheck size={22} color="#34d399" />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Secret Portal Path Configuration</h3>
          </div>

          <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Current Configured Path (from .env)
            </div>
            <code style={{ fontSize: '1rem', color: '#34d399', fontWeight: 700 }}>
              {adminPanelPath}
            </code>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            The administrative operations portal is mounted at a non-obvious URL defined via <code>ADMIN_PANEL_PATH</code> in <code>.env</code>. Public storefront navigation links do not disclose this route.
          </p>
        </div>

        {/* Agricultural GST Rules */}
        <div className="admin-card">
          <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
            <DollarSign size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Agricultural Tax & Invoicing Defaults</h3>
          </div>

          <div className="flex flex-col gap-2.5" style={{ fontSize: '0.85rem' }}>
            <div className="flex justify-between" style={{ borderBottom: '1px solid #1e2e4f', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Default Machinery GST:</span>
              <strong style={{ color: '#ffffff' }}>12% (HSN 8432)</strong>
            </div>
            <div className="flex justify-between" style={{ borderBottom: '1px solid #1e2e4f', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Engine & Generator GST:</span>
              <strong style={{ color: '#ffffff' }}>18% (HSN 8407)</strong>
            </div>
            <div className="flex justify-between" style={{ borderBottom: '1px solid #1e2e4f', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Kisan EMI Max Tenure:</span>
              <strong style={{ color: '#ffffff' }}>36 Months</strong>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Free Shipping Threshold:</span>
              <strong style={{ color: '#34d399' }}>₹4,999 (Pan-India)</strong>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="admin-card md:col-span-2">
          <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
            <Server size={22} color="#38bdf8" />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Architecture & Microservices Status</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ fontSize: '0.85rem' }}>
            <div style={{ background: '#070d1a', padding: '1rem', borderRadius: '8px', border: '1px solid #1e2e4f' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>DATABASE</div>
              <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1rem', marginTop: '0.2rem' }}>MongoDB Replica</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Connected & Indexed</div>
            </div>
            <div style={{ background: '#070d1a', padding: '1rem', borderRadius: '8px', border: '1px solid #1e2e4f' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>AUTHENTICATION</div>
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1rem', marginTop: '0.2rem' }}>Bcrypt + JWT Sessions</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>HttpOnly Cookies + RBAC</div>
            </div>
            <div style={{ background: '#070d1a', padding: '1rem', borderRadius: '8px', border: '1px solid #1e2e4f' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>EMI SERVICE</div>
              <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1rem', marginTop: '0.2rem' }}>Reducing Balance Math</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Formula Validated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
