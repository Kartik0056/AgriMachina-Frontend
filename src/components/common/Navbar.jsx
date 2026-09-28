import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  User,
  PhoneCall,
  Tractor,
  ChevronDown,
  Menu,
  Sun,
  Award,
  MessageSquare,
  Heart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import api from '../../services/api';

import { categoriesData } from './navbar/categoriesData';
import AnnouncementStrip from './navbar/AnnouncementStrip';
import SiddhivaLogo from './SiddhivaLogo';
import UserDropdown from './navbar/UserDropdown';
import CategoryMegaMenu from './navbar/CategoryMegaMenu';
import MobileDrawer from './navbar/MobileDrawer';

const Navbar = () => {
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const { subscribe } = useSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState(categoriesData);
  const [selectedCatId, setSelectedCatId] = useState(categoriesData[0]?.id || 'power-weeder-tiller');
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);

  const navigate = useNavigate();

  const fetchLiveCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
        const mapped = res.data.categories.map((c) => ({
          id: c.slug || c._id,
          _id: c._id,
          name: c.name,
          param: c.name,
          icon: c.icon || '🌱',
          image: c.image || '/images/machinery/power_weeder.jpg',
          tagline: c.tagline || c.description || '',
          startingPrice: c.startingPrice || 'From ₹9,999',
          emiStarting: c.emiStarting || '₹499/mo',
          subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
          features: Array.isArray(c.features) && c.features.length > 0
            ? c.features
            : ['OEM Certified Warranty', 'SMAM DBT Subsidy Approved', 'Free Doorstep Delivery']
        }));
        setCategoriesList(mapped);
      }
    } catch {
      // Fall back to predefined categories
    }
  };

  useEffect(() => {
    fetchLiveCategories();
  }, []);

  const checkUnreadMessages = async () => {
    if (!isAuthenticated) {
      setUnreadSupportCount(0);
      return;
    }
    try {
      const res = await api.get('/support/unread-count');
      if (res.data.success) {
        setUnreadSupportCount(res.data.unreadCount || 0);
      }
    } catch {
      // Silently catch network failures
    }
  };

  useEffect(() => {
    checkUnreadMessages();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleLocalUserRead = (e) => {
      const { count } = e.detail || {};
      if (count !== undefined) {
        setUnreadSupportCount((prev) => Math.max(0, prev - count));
      } else {
        checkUnreadMessages();
      }
    };
    window.addEventListener('user_ticket_read', handleLocalUserRead);
    return () => window.removeEventListener('user_ticket_read', handleLocalUserRead);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === 'NEW_SUPPORT_QUERY' || event.type === 'TICKET_UPDATED') {
        checkUnreadMessages();
      }
      if (event.type === 'CATEGORY_CHANGED' || event.type === 'CATALOG_CHANGED') {
        fetchLiveCategories();
      }
    });
    return unsubscribe;
  }, [subscribe, isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeCategory =
    categoriesList.find((c) => c.id === selectedCatId || c._id === selectedCatId || c.name === selectedCatId) ||
    categoriesList[0] ||
    categoriesData[0];

  return (
    <header className="store-header">
      <AnnouncementStrip />

      <div style={{ padding: '0.75rem 0' }}>
        <div className="container flex items-center justify-between gap-3 store-header-main-row">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden flex items-center justify-center"
              style={{
                background: 'var(--bg-surface-alt, #f1f5f9)',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                color: '#166534',
                flexShrink: 0
              }}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} color="#166534" />
            </button>

            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <SiddhivaLogo size="md" />
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="store-header-search-wrap flex-1" style={{ maxWidth: '560px', display: 'flex' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder', 'Search Spices, Groceries, Electronics, Machinery, Brands (e.g. Everest, Honda, AgriPro)...')}
                className="input-field"
                style={{ paddingLeft: '2.5rem', borderRadius: '8px 0 0 8px', borderRight: 'none', fontSize: '0.85rem' }}
              />
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0', padding: '0 1.1rem', fontWeight: 800, fontSize: '0.85rem' }}>
              {t('search', 'Search')}
            </button>
          </form>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <UserDropdown
                user={user}
                logout={logout}
                t={t}
                wishlistCount={wishlistCount}
                unreadSupportCount={unreadSupportCount}
                userDropdownOpen={userDropdownOpen}
                setUserDropdownOpen={setUserDropdownOpen}
              />
            ) : (
              <Link
                to="/login"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface-alt, #f1f5f9)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#166534',
                  textDecoration: 'none'
                }}
                title={t('login', 'Farmer Login')}
              >
                <User size={18} color="#166534" />
              </Link>
            )}

            <Link
              to="/wishlist"
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: wishlistCount > 0 ? '#fff1f2' : '#ffffff',
                border: wishlistCount > 0 ? '1px solid #fecdd3' : '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
              }}
              title="Saved Wishlist"
            >
              <Heart size={18} color={wishlistCount > 0 ? '#e11d48' : '#64748b'} fill={wishlistCount > 0 ? '#e11d48' : 'none'} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#e11d48',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <Link
                to="/support"
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: unreadSupportCount > 0 ? '#f0fdf4' : '#ffffff',
                  border: unreadSupportCount > 0 ? '1px solid #86efac' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
                title="Support Messages & Advisory"
              >
                <MessageSquare size={18} color="#166534" />
                {unreadSupportCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                      animation: 'pulse 1.5s infinite'
                    }}
                  >
                    {unreadSupportCount}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#166534',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 2px 5px rgba(22, 101, 52, 0.3)'
              }}
              title="View Cart"
            >
              <ShoppingCart size={18} color="#ffffff" />
              {totalItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#f59e0b',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <nav className="hidden md:block" style={{ background: '#0a3d24', color: '#ffffff', borderTop: '1px solid #14532d', position: 'relative' }}>
        <div className="container flex items-center justify-between" style={{ padding: '0.35rem 1.25rem' }}>
          <div className="flex items-center gap-4">
            <div
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              style={{ position: 'relative' }}
            >
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="flex items-center gap-2"
                style={{
                  background: isMegaMenuOpen ? '#166534' : 'rgba(255, 255, 255, 0.12)',
                  color: '#fef08a',
                  border: isMegaMenuOpen ? '1px solid #86efac' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Menu size={18} />
                <span>{t('categories', 'Categories')}</span>
                <ChevronDown size={15} style={{ transform: isMegaMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {isMegaMenuOpen && (
                <CategoryMegaMenu
                  categoriesList={categoriesList}
                  selectedCatId={selectedCatId}
                  setSelectedCatId={setSelectedCatId}
                  setIsMegaMenuOpen={setIsMegaMenuOpen}
                  navigate={navigate}
                  activeCategory={activeCategory}
                  t={t}
                />
              )}
            </div>

            <Link
              to="/products"
              style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              className="hover:text-green-300"
            >
              🌾 {t('all_machinery_catalog', 'All Machinery Catalog')}
            </Link>

            <Link
              to="/products?category=Pumps+%26+Irrigation"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dcfce7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              className="hover:text-yellow-300"
            >
              <Sun size={15} color="#f59e0b" />
              <span>{t('solar_irrigation', 'Solar Irrigation')}</span>
            </Link>

            <Link
              to="/products?category=Power+Weeder+%26+Tiller"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dcfce7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              className="hover:text-yellow-300"
            >
              <Tractor size={15} color="#86efac" />
              <span>{t('power_weeders', 'Power Weeders')}</span>
            </Link>

            <Link
              to="/products?category=Sprayers+%26+Crop+Protection"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dcfce7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              className="hover:text-yellow-300"
            >
              <span>{t('crop_sprayers', 'Crop Sprayers')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px'
              }}
              className="hover:bg-green-800"
            >
              <PhoneCall size={13} color="#86efac" />
              <span>{t('helpline_faqs', 'Helpline & FAQs')}</span>
            </Link>

            <span style={{ fontSize: '0.75rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Award size={13} color="#f59e0b" />
              <span>{t('govt_subsidy', 'Govt. SMAM Subsidy')}</span>
            </span>
          </div>
        </div>
      </nav>

      <MobileDrawer
        mobileDrawerOpen={mobileDrawerOpen}
        setMobileDrawerOpen={setMobileDrawerOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        unreadSupportCount={unreadSupportCount}
        wishlistCount={wishlistCount}
        mobileCategoriesOpen={mobileCategoriesOpen}
        setMobileCategoriesOpen={setMobileCategoriesOpen}
        categoriesList={categoriesList}
        THEMES={THEMES}
        theme={theme}
        setTheme={setTheme}
      />
    </header>
  );
};

export default Navbar;
