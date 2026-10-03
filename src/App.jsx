import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Eager Storefront Essentials for Instant First Paint
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import RippleClickEffect from './components/common/RippleClickEffect';
import EidulaAIChatbot from './components/common/EidulaAIChatbot';
import WelcomeAuthModal from './components/storefront/WelcomeAuthModal';
import CookieConsentBanner from './components/storefront/CookieConsentBanner';
import HomePage from './pages/storefront/HomePage';

// Lazy Loaded Secondary Storefront Pages
const ProductListingPage = lazy(() => import('./pages/storefront/ProductListingPage'));
const ProductDetailPage = lazy(() => import('./pages/storefront/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/storefront/CartPage'));
const CheckoutPage = lazy(() => import('./pages/storefront/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/storefront/OrderConfirmationPage'));
const UserOrdersPage = lazy(() => import('./pages/storefront/UserOrdersPage'));
const UserProfilePage = lazy(() => import('./pages/storefront/UserProfilePage'));
const UserSupportPage = lazy(() => import('./pages/storefront/UserSupportPage'));
const WishlistPage = lazy(() => import('./pages/storefront/WishlistPage'));
const ContactPage = lazy(() => import('./pages/storefront/ContactPage'));
const LoginPage = lazy(() => import('./pages/storefront/LoginPage'));

// Lazy Loaded Protected Admin Portal (Keeps initial customer bundle ultra-light)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminProductEditorPage = lazy(() => import('./pages/admin/AdminProductEditorPage'));
const AdminBulkImportPage = lazy(() => import('./pages/admin/AdminBulkImportPage'));
const AdminInventoryPage = lazy(() => import('./pages/admin/AdminInventoryPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminSupportPage = lazy(() => import('./pages/admin/AdminSupportPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminAuditLogsPage = lazy(() => import('./pages/admin/AdminAuditLogsPage'));
const AdminUsersRolesPage = lazy(() => import('./pages/admin/AdminUsersRolesPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminHeroBannersPage = lazy(() => import('./pages/admin/AdminHeroBannersPage'));
const AdminEMIPage = lazy(() => import('./pages/admin/AdminEMIPage'));
const AdminSEOPage = lazy(() => import('./pages/admin/AdminSEOPage'));
const AdminRecommendationsPage = lazy(() => import('./pages/admin/AdminRecommendationsPage'));

import { useAdminAuth } from './context/AdminAuthContext';

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div
      style={{
        width: '38px',
        height: '38px',
        border: '3px solid rgba(22, 101, 52, 0.15)',
        borderTopColor: '#166534',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite'
      }}
    />
  </div>
);

function App() {
  const { adminPanelPath } = useAdminAuth();
  const location = useLocation();

  const currentAdminPath = adminPanelPath || '/secure-admin-portal';
  const portalPath = currentAdminPath.startsWith('/') ? currentAdminPath.slice(1) : currentAdminPath;
  const isAdminRoute = location.pathname.startsWith(currentAdminPath);

  return (
    <div className="app-root">
      <ScrollToTop />
      <RippleClickEffect />

      {!isAdminRoute && <Navbar />}

      <div style={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
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
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductEditorPage />} />
              <Route path="products/edit/:id" element={<AdminProductEditorPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="bulk-import" element={<AdminBulkImportPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="support" element={<AdminSupportPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="users-roles" element={<AdminUsersRolesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="banners" element={<AdminHeroBannersPage />} />
              <Route path="emi-schemes" element={<AdminEMIPage />} />
              <Route path="seo" element={<AdminSEOPage />} />
              <Route path="recommendations" element={<AdminRecommendationsPage />} />
            </Route>

            {/* Fallback wildcard to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>

      <WelcomeAuthModal />
      <CookieConsentBanner />
      {!isAdminRoute && <EidulaAIChatbot />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
