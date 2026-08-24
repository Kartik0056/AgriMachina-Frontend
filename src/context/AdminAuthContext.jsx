import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/adminApi';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminPanelPath, setAdminPanelPath] = useState('/secure-admin-portal');

  useEffect(() => {
    const initAdmin = async () => {
      const storedToken = localStorage.getItem('admin_token');
      if (storedToken) {
        try {
          const res = await adminApi.get('/auth/me');
          if (res.data.success) {
            setAdmin(res.data.admin);
            if (res.data.adminPanelPath) setAdminPanelPath(res.data.adminPanelPath);
          }
        } catch (err) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    initAdmin();
  }, []);

  const login = async (identifier, password) => {
    const res = await adminApi.post('/auth/login', { identifier, password });
    if (res.data.success) {
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);
      if (res.data.adminPanelPath) setAdminPanelPath(res.data.adminPanelPath);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const logout = async () => {
    try {
      await adminApi.post('/auth/logout');
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdmin(null);
    }
  };

  const hasPermission = (permission) => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN') return true;
    return (admin.permissions || []).includes(permission);
  };

  const hasRole = (roleName) => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN') return true;
    return admin.role === roleName;
  };

  return (
    <AdminAuthContext.Provider value={{
      admin,
      loading,
      login,
      logout,
      hasPermission,
      hasRole,
      adminPanelPath,
      isAuthenticated: !!admin
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
