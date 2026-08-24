import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminApi from '../../services/adminApi';

const AdminLayout = () => {
  const { isAuthenticated, loading, adminPanelPath } = useAdminAuth();
  const location = useLocation();
  const [stats, setStats] = useState({ pendingReviews: 0, pendingOrders: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      const loadQuickStats = async () => {
        try {
          const res = await adminApi.get('/dashboard/stats');
          if (res.data.success) {
            setStats({
              pendingReviews: res.data.stats.pendingReviews || 0,
              pendingOrders: res.data.stats.pendingOrders || 0
            });
          }
        } catch (e) {}
      };
      loadQuickStats();
    }
  }, [isAuthenticated, location.pathname]);

  if (loading) {
    return (
      <div style={{ background: '#0b1324', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading Admin Operations Portal...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`${adminPanelPath}/login`} state={{ from: location }} replace />;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        pendingReviewsCount={stats.pendingReviews}
        pendingOrdersCount={stats.pendingOrders}
      />
      <div className="admin-main">
        <AdminTopBar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
