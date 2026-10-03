import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  User,
  PhoneCall,
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
import EidulaLogo from './EidulaLogo';
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
  const [selectedCatId, setSelectedCatId] = useState(categoriesData[0]?.id || 'spices-masale');
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
          icon: c.icon || '🛍️',
          image: c.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
          tagline: c.tagline || c.description || '',
          startingPrice: c.startingPrice || 'From ₹99',
          emiStarting: c.emiStarting || '₹149/mo',
          subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
          features: Array.isArray(c.features) && c.features.length > 0
            ? c.features
            : ['100% Genuine Certified Quality', 'Pan-India Express Delivery', 'Easy 0% No-Cost EMI Available']
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
                color: 'var(--primary-600, #166534)',
                flexShrink: 0
              }}
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} color="var(--primary-600, #166534)" />
            </button>

            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <EidulaLogo size="md" />
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="store-header-search-wrap flex-1"
            style={{
              maxWidth: '560px',
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-surface-alt, #f8fafc)',
              borderRadius: '999px',
              border: '1.5px solid var(--border-color, #e2e8f0)',
              padding: '2px 3px 2px 0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
              <Search
                size={16}
                color="var(--text-muted, #64748b)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder', 'Search pure spices, gadgets, luxury home decor, appliances...')}
                className="input-field"
                style={{
                  paddingLeft: '2.65rem',
                  paddingRight: '0.75rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.825rem',
                  height: '38px',
                  outline: 'none',
                  color: 'var(--text-main)',
                  boxShadow: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-sm"
              style={{
                borderRadius: '999px',
                padding: '0.45rem 1.2rem',
                fontWeight: 700,
                fontSize: '0.8rem',
                background: 'linear-gradient(135deg, #051c14 0%, #166534 100%)',
                color: '#ffffff',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 2px 8px rgba(22, 101, 52, 0.25)',
                flexShrink: 0
              }}
            >
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
                  color: 'var(--primary-600, #166534)',
                  textDecoration: 'none'
                }}
                title={t('login', 'Customer Login')}
              >
                <User size={18} color="var(--primary-600, #166534)" />
              </Link>
            )}

            <Link
              to="/wishlist"
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: wishlistCount > 0 ? 'rgba(225, 29, 72, 0.12)' : 'var(--bg-surface-alt, #ffffff)',
                border: wishlistCount > 0 ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid var(--border-color, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Saved Wishlist"
            >
              <Heart size={18} color={wishlistCount > 0 ? '#e11d48' : 'var(--text-muted, #64748b)'} fill={wishlistCount > 0 ? '#e11d48' : 'none'} />
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
                  background: unreadSupportCount > 0 ? 'rgba(22, 163, 74, 0.15)' : 'var(--bg-surface-alt, #ffffff)',
                  border: unreadSupportCount > 0 ? '1px solid var(--primary-400, #86efac)' : '1px solid var(--border-color, #e2e8f0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
                title="Support Messages & Advisory"
              >
                <MessageSquare size={18} color="var(--primary-600, #166534)" />
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
                background: 'var(--primary-600, #166534)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
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

      <nav
        className="hidden md:block store-nav-subbar"
        style={{
          background: 'var(--primary-800, #0a3d24)',
          color: '#ffffff',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div
          className="container flex items-center justify-between"
          style={{
            padding: '0.35rem 1.25rem',
            flexWrap: 'nowrap',
            gap: '1.25rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex items-center gap-3.5" style={{ flexWrap: 'nowrap', flexShrink: 0 }}>
            <div
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className="flex items-center gap-2"
                style={{
                  background: isMegaMenuOpen ? 'var(--primary-600, #166534)' : 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: isMegaMenuOpen ? '1px solid var(--primary-400, #86efac)' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Menu size={17} />
                <span>{t('categories', 'Categories')}</span>
                <ChevronDown size={14} style={{ transform: isMegaMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
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
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              className="hover:text-green-300"
            >
              <span>🛍️</span>
              <span>{t('all_products_catalog', 'All Products Catalog')}</span>
            </Link>

            <Link
              to="/products?category=Spices+%26+Masale"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#dcfce7',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              className="hover:text-yellow-300"
            >
              <span>🌶️</span>
              <span>{t('spices_masale', 'Pure Spices & Masale')}</span>
            </Link>

            <Link
              to="/products?category=Electronics+%26+Smart+Tech"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#dcfce7',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              className="hover:text-yellow-300"
            >
              <span>⚡</span>
              <span>{t('electronics', 'Electronics & Gadgets')}</span>
            </Link>

            <Link
              to="/products?category=Home+Decor+%26+Living"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#dcfce7',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              className="hover:text-yellow-300"
            >
              <span>🏺</span>
              <span>{t('home_decor', 'Home Decor & Living')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3" style={{ flexWrap: 'nowrap', flexShrink: 0 }}>
            <Link
              to="/contact"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              className="hover:bg-green-800"
            >
              <PhoneCall size={13} color="#86efac" />
              <span>{t('helpline_faqs', 'Helpline & FAQs')}</span>
            </Link>

            <span style={{ fontSize: '0.75rem', color: '#86efac', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Award size={13} color="#f59e0b" />
              <span>{t('pan_india_delivery', 'Pan-India Express Delivery')}</span>
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
