import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Storefront Components & Pages
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import FarmingCursorParticles from './components/common/FarmingCursorParticles';
import KisanAIChatbot from './components/common/KisanAIChatbot';
import HomePage from './pages/storefront/HomePage';
import ProductListingPage from './pages/storefront/ProductListingPage';
import ProductDetailPage from './pages/storefront/ProductDetailPage';
import CartPage from './pages/storefront/CartPage';
import CheckoutPage from './pages/storefront/CheckoutPage';
import OrderConfirmationPage from './pages/storefront/OrderConfirmationPage';
import UserOrdersPage from './pages/storefront/UserOrdersPage';
import UserProfilePage from './pages/storefront/UserProfilePage';
import UserSupportPage from './pages/storefront/UserSupportPage';
import WishlistPage from './pages/storefront/WishlistPage';
import ContactPage from './pages/storefront/ContactPage';
import LoginPage from './pages/storefront/LoginPage';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditorPage from './pages/admin/AdminProductEditorPage';
import AdminBulkImportPage from './pages/admin/AdminBulkImportPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSupportPage from './pages/admin/AdminSupportPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';
import AdminUsersRolesPage from './pages/admin/AdminUsersRolesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminEMIPage from './pages/admin/AdminEMIPage';
import AdminSEOPage from './pages/admin/AdminSEOPage';
import AdminRecommendationsPage from './pages/admin/AdminRecommendationsPage';

import { useAdminAuth } from './context/AdminAuthContext';

function App() {
  const { adminPanelPath } = useAdminAuth();
  const location = useLocation();

  // Strip leading slash if any for relative route matching
  const portalPath = adminPanelPath.startsWith('/') ? adminPanelPath.slice(1) : adminPanelPath;
  const isAdminRoute = location.pathname.startsWith(adminPanelPath);

  return (
    <div className="app-root">
      {/* Automatically reset window scroll to top on page navigation */}
      <ScrollToTop />

      {/* Agricultural Farming Particles on Cursor Motion & Clicks */}
      <FarmingCursorParticles />

      {/* Show public navbar ONLY on storefront routes, NEVER inside secret admin portal */}
      {!isAdminRoute && <Navbar />}

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<UserOrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/support" element={<UserSupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dedicated Non-Obvious Admin Login */}
          <Route path={`/${portalPath}/login`} element={<AdminLoginPage />} />

          {/* Convenient Aliases for Admin Portal */}
          <Route path="/admin" element={<Navigate to={`/${portalPath}`} replace />} />
          <Route path="/admin/login" element={<Navigate to={`/${portalPath}/login`} replace />} />
          <Route path="/admin/*" element={<Navigate to={`/${portalPath}`} replace />} />
          <Route path="/secure admin portal/*" element={<Navigate to={`/${portalPath}`} replace />} />
          <Route path="/secure admin portal" element={<Navigate to={`/${portalPath}`} replace />} />
          <Route path="/secure%20admin%20portal/*" element={<Navigate to={`/${portalPath}`} replace />} />
          <Route path="/secure%20admin%20portal" element={<Navigate to={`/${portalPath}`} replace />} />

          {/* Dedicated Non-Obvious Protected Admin CMS Operations Suite */}
          <Route path={`/${portalPath}`} element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductEditorPage />} />
            <Route path="products/edit/:id" element={<AdminProductEditorPage />} />
            <Route path="products/bulk-import" element={<AdminBulkImportPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="emi" element={<AdminEMIPage />} />
            <Route path="seo" element={<AdminSEOPage />} />
            <Route path="recommendations" element={<AdminRecommendationsPage />} />
            <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="users-roles" element={<AdminUsersRolesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="*" element={<Navigate to={`/${portalPath}`} replace />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Free Intelligent Multilingual Agricultural Chatbot */}
      {!isAdminRoute && <KisanAIChatbot />}

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
