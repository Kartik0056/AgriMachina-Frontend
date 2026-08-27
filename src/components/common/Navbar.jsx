import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  User,
  PhoneCall,
  Tractor,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Package,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  CreditCard,
  Menu,
  Flame,
  Sun,
  Moon,
  Trees,
  Palette,
  Check,
  Globe,
  Award,
  MessageSquare,
  Heart,
  X
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import api from '../../services/api';
import CategoryIcon from './CategoryIcon';

const categoriesData = [
  {
    id: 'power-weeder-tiller',
    name: 'Power Weeder & Tiller',
    param: 'Power Weeder & Tiller',
    icon: '🌱',
    image: '/images/machinery/power_weeder.jpg',
    tagline: 'High-torque petrol & diesel weeders for deep soil cultivation in cotton, sugarcane, and vegetables.',
    startingPrice: '₹38,499',
    emiStarting: '₹1,171/mo',
    subcategories: [
      { name: '7HP Petrol Power Weeders (208cc)', slug: 'petrol-weeders' },
      { name: '9HP Heavy Diesel Tillers', slug: 'diesel-weeders' },
      { name: 'Mini Rotary Cultivators', slug: 'mini-cultivators' },
      { name: 'Inter-Row Cotton & Sugarcane Weeders', slug: 'inter-row-weeders' }
    ],
    features: [
      '32 Heat-Treated Boron Steel Blades',
      '2 Forward + 1 Reverse Gearbox',
      '360° Height Adjustable Handlebars'
    ]
  },
  {
    id: 'earth-auger',
    name: 'Earth Auger',
    param: 'Earth Auger',
    icon: '⛏️',
    image: '/images/machinery/rotavator.jpg',
    tagline: '1-man and 2-man high-speed soil drillers for orchard plantation and fence posts.',
    startingPrice: '₹14,999',
    emiStarting: '₹499/mo',
    subcategories: [
      { name: '52cc 1-Man Soil Auger', slug: '1-man-auger' },
      { name: '68cc Heavy Duty 2-Man Auger', slug: '2-man-auger' },
      { name: '4" to 12" Alloy Drill Bits', slug: 'drill-bits' }
    ],
    features: [
      'Heavy Dual Handle Shock Reduction',
      'Forged Alloy Tungsten Tip Bits',
      'Bore 1m Deep in 45 Seconds'
    ]
  },
  {
    id: 'pumps-irrigation',
    name: 'Pumps & Irrigation',
    param: 'Pumps & Irrigation',
    icon: '☀️',
    image: '/images/machinery/solar_pump.jpg',
    tagline: 'Solar submersible pumps, high-head DC brushless motors, and precision drip irrigation.',
    startingPrice: '₹74,999',
    emiStarting: '₹2,280/mo',
    subcategories: [
      { name: '5HP Solar Submersible Pump Sets', slug: 'solar-submersible' },
      { name: 'Smart MPPT Solar Controllers', slug: 'mppt-controllers' },
      { name: 'Centrifugal Farm Water Pumps', slug: 'petrol-pumps' }
    ],
    features: [
      '35,000 LPH High Discharge',
      'Up to 120m Deep Borewell Head',
      'Zero Electricity Bill for 25+ Years'
    ]
  },
  {
    id: 'sprayers-crop-protection',
    name: 'Sprayers & Crop Protection',
    param: 'Sprayers & Crop Protection',
    icon: '💧',
    image: '/images/machinery/sprayer.jpg',
    tagline: '16L / 20L battery knapsack sprayers and engine HTP power sprayers.',
    startingPrice: '₹3,499',
    emiStarting: '₹299/mo',
    subcategories: [
      { name: '16L / 20L Battery Knapsacks', slug: 'battery-knapsack' },
      { name: '2-in-1 Battery cum Manual', slug: '2in1-sprayers' },
      { name: 'Portable Petrol Engine HTP', slug: 'htp-sprayers' }
    ],
    features: [
      '12V 12Ah Dual Motor High Pressure',
      'Up to 8 Hours Continuous Spray',
      'Telescopic Brass Wand Included'
    ]
  },
  {
    id: 'harvesting-machinery',
    name: 'Harvesting Machinery',
    param: 'Harvesting Machinery',
    icon: '🌾',
    image: '/images/machinery/brush_cutter.jpg',
    tagline: 'Backpack multi-crop brush cutters, paddy harvesters, and crop reapers.',
    startingPrice: '₹23,999',
    emiStarting: '₹1,027/mo',
    subcategories: [
      { name: '50cc Backpack Multi-Crop Cutters', slug: 'backpack-brush-cutters' },
      { name: '80T Alloy Harvester Blades', slug: 'harvester-blades' },
      { name: 'Paddy Harvesting Attachments', slug: 'paddy-collectors' }
    ],
    features: [
      '2.2 HP High-Torque 2-Stroke Engine',
      'Ergonomic Shock-Absorbing Backpack',
      'Cuts Paddy, Wheat, Fodder & Cane'
    ]
  },
  {
    id: 'post-harvesting',
    name: 'Post Harvesting',
    param: 'Post Harvesting',
    icon: '🚜',
    image: '/images/machinery/rotavator.jpg',
    tagline: 'Electric fodder chaff cutters, multi-crop grain threshers, and flour mills.',
    startingPrice: '₹18,500',
    emiStarting: '₹699/mo',
    subcategories: [
      { name: 'Electric Fodder & Chaff Cutters', slug: 'chaff-cutters' },
      { name: 'Multi-Crop Grain Threshers', slug: 'grain-threshers' }
    ],
    features: [
      'Heavy-Duty Reversible Blades',
      'Chops Fodder up to 1000 kg/hr',
      'Zero Grain Wastage High Output'
    ]
  },
  {
    id: 'power-reaper',
    name: 'Power Reaper',
    param: 'Power Reaper',
    icon: '⚡',
    image: '/images/machinery/brush_cutter.jpg',
    tagline: 'Self-propelled paddy, wheat, and soybean crop reapers with automated windrowing.',
    startingPrice: '₹1,15,000',
    emiStarting: '₹3,450/mo',
    subcategories: [
      { name: 'Walking Tractor Crop Reapers', slug: 'walking-reaper' },
      { name: 'Multi-Crop Reaper Binder', slug: 'reaper-binder' }
    ],
    features: [
      'Reaps 1 Acre of Crop in 45 Minutes',
      '95% Labor Cost Reduction',
      'Neat Row Windrowing on Farm Soil'
    ]
  },
  {
    id: 'lawn-mower-gardening',
    name: 'Lawn Mower & Gardening Tools',
    param: 'Lawn Mower & Gardening Tools',
    icon: '✂️',
    image: '/images/machinery/brush_cutter.jpg',
    tagline: 'High-torque hedge trimmers, self-propelled lawn mowers, and chainsaws.',
    startingPrice: '₹8,999',
    emiStarting: '₹349/mo',
    subcategories: [
      { name: 'Self-Propelled Petrol Lawn Mowers', slug: 'lawn-mowers' },
      { name: 'Hedge Trimmers & Pruners', slug: 'hedge-trimmers' }
    ],
    features: [
      'Precision Grass Height Adjustment',
      'Hardened Steel Cutting Blades'
    ]
  },
  {
    id: 'power-engines',
    name: 'Power & Engines',
    param: 'Power & Engines',
    icon: '⚙️',
    image: '/images/machinery/power_weeder.jpg',
    tagline: 'General purpose 4-stroke OHV petrol engines and diesel power blocks.',
    startingPrice: '₹11,999',
    emiStarting: '₹450/mo',
    subcategories: [
      { name: '7HP 208cc Petrol Engines', slug: 'petrol-engines' },
      { name: '9HP / 12HP Diesel Engines', slug: 'diesel-engines' }
    ],
    features: [
      'Cast-Iron Cylinder Sleeve',
      'Low Fuel Consumption (650 ml/hr)'
    ]
  },
  {
    id: 'accessories-attachment',
    name: 'Accessories & Attachment',
    param: 'Accessories & Attachment',
    icon: '🔩',
    image: '/images/machinery/rotavator.jpg',
    tagline: 'Boron steel tilling blades, rotavator implements, and high-pressure spray hoses.',
    startingPrice: '₹1,299',
    emiStarting: 'Under ₹499',
    subcategories: [
      { name: '32-Piece Boron Tilling Blades', slug: 'tilling-blades' },
      { name: 'Adjustable Furrower & Ridger Kits', slug: 'ridger-kits' }
    ],
    features: [
      'Forged High-Strength Boron Steel',
      'Original Manufacturer Warranty'
    ]
  }
];

const tickerAnnouncements = [
  { icon: '🌾', text: '100% Genuine Machinery with Direct OEM Warranty & Free Tool Kits', highlight: 'OEM Certified' },
  { icon: '🚚', text: '100% Free Palletized Farm Delivery Across India • Dispatched in 24 Hours', highlight: 'Fast Dispatch' },
  { icon: '💳', text: '0% No-Cost EMI Available on SBI Kisan Credit Card & Leading Agri Banks', highlight: '0% Interest' },
  { icon: '🏛️', text: 'Govt. SMAM / DBT Subsidy Approved • GST Invoicing with Engine & Chassis Nos.', highlight: 'Up to 50% Off' },
  { icon: '📞', text: 'Kisan 24x7 Helpline: 1800-AGRI-FARM (Toll-Free) • WhatsApp: +91 90277 99171', highlight: '24x7 Support', isHelpline: true }
];

const Navbar = () => {
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const { language, setLanguage, t, currentLangMeta } = useLanguage();
  const { subscribe } = useSync();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState(categoriesData);
  const [selectedCatId, setSelectedCatId] = useState(categoriesData[0]?.id || 'power-weeder-tiller');
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const navigate = useNavigate();

  const themeDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

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
    } catch (e) {}
  };

  useEffect(() => {
    fetchLiveCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setThemeDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerAnnouncements.length);
    }, 3800);
    return () => clearInterval(timer);
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
    } catch (err) {
      // Silently catch
    }
  };

  // Initial fetch on login
  useEffect(() => {
    checkUnreadMessages();
  }, [isAuthenticated]);

  // Local window event sync for instant optimistic read updates
  useEffect(() => {
    const handleLocalUserRead = (e) => {
      const { count } = e.detail || {};
      if (count !== undefined) {
        setUnreadSupportCount(prev => Math.max(0, prev - count));
      } else {
        checkUnreadMessages();
      }
    };
    window.addEventListener('user_ticket_read', handleLocalUserRead);
    return () => window.removeEventListener('user_ticket_read', handleLocalUserRead);
  }, []);

  // Real-time update on live SSE events (Zero polling, Zero spam)
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
  const curTicker = tickerAnnouncements[tickerIndex];

  return (
    <header className="store-header">
      {/* 1. Dynamic Animated Center Announcement & Helpline Strip */}
      <div className="top-announcement-strip" style={{
        background: 'linear-gradient(90deg, #05190e, #0c3e27, #05190e)',
        color: '#ffffff',
        fontSize: '0.825rem',
        padding: '0.4rem 1rem',
        borderBottom: '1px solid #14532d',
        position: 'relative',
        zIndex: 1100
      }}>
        <div className="container flex items-center justify-between" style={{ minHeight: '26px', gap: '0.5rem' }}>
          {/* Left subtle label (desktop only) */}
          <div className="hidden lg:flex items-center gap-1.5" style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, flexShrink: 0 }}>
            <Sparkles size={14} color="#f59e0b" />
            <span>Kisan Priority Desk</span>
          </div>

          {/* Centered Dynamic Animated Announcement Ticker */}
          <div
            key={tickerIndex}
            className="top-ticker-text flex items-center justify-center gap-1.5 flex-1 text-center"
            style={{
              animation: 'fadeInUp 0.45s ease-out forwards',
              padding: '0 0.25rem'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>{curTicker.icon}</span>
            <span style={{ fontWeight: 600, color: '#f8fafc', letterSpacing: '0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {curTicker.text}
            </span>
            <span
              className="badge hide-on-mobile"
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                background: '#15803d',
                color: '#fef08a',
                border: '1px solid #86efac',
                padding: '0.1rem 0.45rem',
                borderRadius: '12px',
                flexShrink: 0
              }}
            >
              {curTicker.highlight}
            </span>
          </div>

          {/* Right Direct Helpline, Language & Theme Controls */}
          <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
            {/* Language Selector Dropdown */}
            <div style={{ position: 'relative' }} ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '7px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="hover:bg-green-900"
                title="Change Language / भाषा बदलें"
              >
                <Globe size={13} color="#86efac" />
                <span>{currentLangMeta.native}</span>
                <ChevronDown size={10} />
              </button>

              {langDropdownOpen && (
                <div
                  className="top-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    background: 'var(--bg-surface, #ffffff)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '10px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                    zIndex: 1200,
                    minWidth: '165px',
                    overflow: 'hidden',
                    padding: '5px'
                  }}
                >
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        background: language === lang.code ? 'var(--primary-50, #f0fdf4)' : 'transparent',
                        color: language === lang.code ? '#166534' : 'var(--text-main, #1e293b)',
                        fontWeight: language === lang.code ? 800 : 600,
                        fontSize: '0.8rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s ease'
                      }}
                      className="hover:bg-green-50 dark:hover:bg-slate-800"
                    >
                      <span className="flex items-center gap-2" style={{ color: language === lang.code ? '#166534' : 'var(--text-main, #1e293b)' }}>
                        <span>{lang.flag}</span>
                        <span style={{ color: language === lang.code ? '#166534' : 'var(--text-main, #1e293b)' }}>{lang.native}</span>
                      </span>
                      {language === lang.code && <CheckCircle2 size={14} color="#166534" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Store Multi-Theme Selector Dropdown */}
            <div style={{ position: 'relative' }} ref={themeDropdownRef}>
              <button
                type="button"
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '7px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="hover:bg-green-900"
                title="Select Theme / थीम बदलें"
              >
                <span>{THEMES.find(t => t.id === theme)?.icon || '🎨'}</span>
                <span className="hide-on-mobile">{THEMES.find(t => t.id === theme)?.name.split(' ')[0] || 'Theme'}</span>
                <ChevronDown size={10} />
              </button>

              {themeDropdownOpen && (
                <div
                  className="top-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    background: 'var(--bg-surface, #ffffff)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '12px',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                    zIndex: 1200,
                    minWidth: '220px',
                    overflow: 'hidden',
                    padding: '6px'
                  }}
                >
                  <div style={{
                    padding: '0.4rem 0.6rem',
                    borderBottom: '1px solid var(--border-color, #e2e8f0)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: 'var(--text-muted, #64748b)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Select Store Theme
                  </div>
                  {THEMES.map(thm => {
                    const isCur = theme === thm.id;
                    return (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => {
                          setTheme(thm.id);
                          setThemeDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          border: 'none',
                          background: isCur ? 'var(--primary-50, rgba(22, 101, 52, 0.15))' : 'transparent',
                          color: isCur ? 'var(--primary-600, #166534)' : 'var(--text-main, #1e293b)',
                          fontWeight: isCur ? 800 : 600,
                          fontSize: '0.8rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          margin: '2px 0',
                          transition: 'background 0.12s ease'
                        }}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <span style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: thm.bgPreview,
                            border: `2px solid ${thm.primaryColor}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem'
                          }}>
                            {thm.icon}
                          </span>
                          <span style={{ color: isCur ? 'var(--primary-600, #166534)' : 'var(--text-main, #1e293b)' }}>{thm.name}</span>
                        </div>
                        {isCur && <Check size={14} color={thm.primaryColor} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick 1-Click Toggle between Day Light and Midnight Dark */}
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease'
              }}
              className="hover:scale-110 active:scale-95"
              title={isDark ? 'Switch to Day Light Mode' : 'Switch to Dark Farm Mode'}
            >
              {isDark ? <Sun size={14} color="#fef08a" /> : <Moon size={14} color="#86efac" />}
            </button>

            <a
              href="tel:1800123456"
              className="hide-on-mobile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#fef08a',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.775rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid rgba(254,240,138,0.3)',
                flexShrink: 0
              }}
            >
              <PhoneCall size={12} color="#f59e0b" />
              <span>1800-AGRI-FARM</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div style={{ padding: '0.75rem 0' }}>
        <div className="container flex items-center justify-between gap-3 store-header-main-row">
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Drawer Toggle */}
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

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                background: 'linear-gradient(135deg, #125435, #166534)',
                color: '#ffffff',
                padding: '0.45rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(22, 101, 52, 0.25)'
              }}>
                <Tractor size={24} color="#34d399" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-main, #062416)', lineHeight: 1.1 }}>
                  AGRI<span style={{ color: '#16a34a' }}>MACHINA</span>
                </div>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Farmer Direct Equipment
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
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

          {/* User Account & Cart Actions (Clean Icon-Only Buttons) */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.2rem',
                    cursor: 'pointer',
                    borderRadius: '50%'
                  }}
                  title={user?.name || 'My Farmer Account'}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #16a34a',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #125435, #16a34a)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                    </div>
                  )}
                  <ChevronDown size={13} color="#475569" style={{ marginLeft: '2px' }} />
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '105%',
                      width: '220px',
                      background: 'var(--bg-surface)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#166534', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                          {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                        </div>
                      )}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                      }}
                    >
                      <User size={15} color="#166534" />
                      <span>{t('my_profile', 'My Profile')}</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-main, #0f172a)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                      }}
                    >
                      <Package size={15} color="#166534" />
                      <span>{t('my_orders', 'My Orders & Invoices')}</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-main, #0f172a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Heart size={15} color="#dc2626" />
                        <span>{t('saved_wishlist', 'Saved Wishlist')}</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="badge" style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#dc2626', fontWeight: 800 }}>
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/support"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-main, #0f172a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare size={15} color="#166534" />
                        <span>{t('support_messages', 'Support Messages')}</span>
                      </div>
                      {unreadSupportCount > 0 && (
                        <span className="badge badge-accent" style={{ fontSize: '0.65rem', background: '#dc2626', color: '#ffffff' }}>
                          {unreadSupportCount}
                        </span>
                      )}
                    </Link>

                    <div style={{ borderTop: '1px solid var(--border-color, #f1f5f9)', paddingTop: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.75rem',
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          fontWeight: 700,
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          borderRadius: '6px'
                        }}
                      >
                        {t('logout', 'Logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

            {/* Wishlist Icon Button with Counter Badge */}
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
                <span style={{
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
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Support Messages Icon Button with Live Unread Notification Badge */}
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
                  <span style={{
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
                  }}>
                    {unreadSupportCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Icon Button with Counter Badge */}
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
                <span style={{
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
                }}>
                  {totalItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Secondary Nav Bar: Desktop Complete View */}
      <nav className="hidden md:block" style={{ background: '#0a3d24', color: '#ffffff', borderTop: '1px solid #14532d', position: 'relative' }}>
        <div className="container flex items-center justify-between" style={{ padding: '0.35rem 1.25rem' }}>
          <div className="flex items-center gap-4">
            {/* The single "Categories ▾" button that triggers the floating flyout on hover */}
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

              {/* 4. Compact Floating Mega-Menu Flyout (760px Width - DOES NOT COVER WHOLE SCREEN) */}
              {isMegaMenuOpen && (
                <div
                  className="mega-menu-flyout"
                  style={{
                    display: 'flex',
                    minHeight: '430px',
                    maxHeight: '520px'
                  }}
                >
                  {/* Left Column (270px): Vertical Category List with Badges */}
                  <div
                    style={{
                      width: '270px',
                      background: 'var(--bg-surface-alt)',
                      borderRight: '1px solid #e2e8f0',
                      padding: '0.75rem',
                      overflowY: 'auto'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.5rem 0.5rem 0.5rem' }}>
                      {t('product_categories', 'Product Categories')}
                    </div>

                    <div className="flex flex-col gap-1">
                      {categoriesList.map((cat) => {
                        const isSelected = selectedCatId === cat.id || selectedCatId === cat._id;
                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setSelectedCatId(cat.id)}
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              navigate(`/products?category=${encodeURIComponent(cat.param)}`);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.55rem 0.75rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              background: isSelected ? '#166534' : 'transparent',
                              color: isSelected ? '#ffffff' : '#1e293b',
                              border: isSelected ? '1px solid #16a34a' : '1px solid transparent',
                              boxShadow: isSelected ? '0 2px 8px rgba(22, 101, 52, 0.12)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div className="flex items-center gap-2.5" style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                                  borderRadius: '6px'
                                }}
                              >
                                <CategoryIcon icon={cat.icon} size={17} color={isSelected ? '#ffffff' : '#166534'} />
                              </div>
                              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.825rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#ffffff' : '#1e293b', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {cat.name}
                                </div>
                                <div style={{ fontSize: '0.675rem', color: isSelected ? '#bbf7d0' : '#64748b', marginTop: '2px' }}>
                                  {cat.startingPrice}
                                </div>
                              </div>
                            </div>
                            <ChevronRight size={14} color={isSelected ? '#86efac' : '#94a3b8'} style={{ flexShrink: 0 }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column (490px): Selected Category Deep-Dive */}
                  <div
                    style={{
                      flex: 1,
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface)'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.85rem' }}>
                        <div className="flex items-center gap-2.5">
                          <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', borderRadius: '8px', flexShrink: 0 }}>
                            <CategoryIcon icon={activeCategory.icon} size={22} color="#166534" />
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                              {activeCategory.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {activeCategory.tagline}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                        Popular Variants & Implements
                      </div>

                      <div className="grid grid-cols-2 gap-2" style={{ marginBottom: '1rem' }}>
                        {(activeCategory.subcategories || []).map((sub, idx) => (
                          <Link
                            key={idx}
                            to={`/products?category=${encodeURIComponent(activeCategory.param || activeCategory.name)}&sub=${encodeURIComponent(sub.slug)}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.45rem 0.65rem',
                              background: 'var(--bg-surface-alt)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              fontSize: '0.775rem',
                              fontWeight: 600,
                              color: '#334155',
                              textDecoration: 'none',
                              transition: 'all 0.15s ease'
                            }}
                            className="hover:border-green-500 hover:text-green-800 hover:bg-green-50"
                          >
                            <Zap size={13} color="#16a34a" />
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '0.5rem' }}>
                        {(activeCategory.features || []).map((feat, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.7rem',
                              color: '#166534',
                              background: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              borderRadius: '4px',
                              padding: '0.2rem 0.5rem',
                              fontWeight: 600
                            }}
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(135deg, #14532d, #166534)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: '#ffffff'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--bg-surface)',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            padding: '2px',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={activeCategory.image}
                            alt={activeCategory.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                            {activeCategory.name}
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fef08a' }}>
                              From {activeCategory.startingPrice}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#86efac' }}>
                              • {activeCategory.emiStarting}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/products?category=${encodeURIComponent(activeCategory.param)}`}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="btn btn-accent btn-sm"
                        style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 800, padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                      >
                        <span>Explore</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Quick Links */}
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

          {/* Right side quick links */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.12)', padding: '0.25rem 0.65rem', borderRadius: '6px' }}
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

      {/* ========================================================================= */}
      {/* 4. MOBILE SLIDE-IN DRAWER SIDEBAR (100% COMPLETE FEATURE ACCESS ON MOBILE) */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex' }}>
          {/* Dark Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.2s ease-out forwards'
            }}
          />

          {/* Slide-In Drawer Panel */}
          <div
            style={{
              position: 'relative',
              width: '320px',
              maxWidth: '85vw',
              height: '100%',
              background: 'var(--bg-surface, #ffffff)',
              color: 'var(--text-main, #0f172a)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 1000000,
              boxShadow: '6px 0 30px rgba(0,0,0,0.35)',
              overflowY: 'auto'
            }}
          >
            {/* Drawer Top Header */}
            <div>
              <div style={{ padding: '1.15rem 1.25rem', background: 'linear-gradient(135deg, #052e16, #14532d)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="flex items-center gap-2.5">
                  <div style={{ background: '#166534', padding: '0.4rem', borderRadius: '8px' }}>
                    <Tractor size={22} color="#86efac" />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
                      AGRI<span style={{ color: '#86efac' }}>MACHINA</span>
                    </div>
                    <div style={{ fontSize: '0.625rem', color: '#bbf7d0', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Farmer Direct Equipment
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Profile / Login Bar */}
              <div style={{ padding: '0.85rem 1.25rem', background: 'var(--bg-surface-alt, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#166534', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.phone || user?.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setMobileDrawerOpen(false); logout(); }}
                      style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}
                  >
                    <User size={15} />
                    <span>Farmer Login / Register</span>
                  </Link>
                )}
              </div>

              {/* Navigation Links */}
              <div style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0.5rem' }}>
                  Quick Navigation
                </div>

                <Link
                  to="/products"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  className="hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <span>🌾</span>
                  <span>All Machinery Catalog</span>
                </Link>

                <Link
                  to="/products?category=Pumps+%26+Irrigation"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  className="hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <Sun size={17} color="#f59e0b" />
                  <span>Solar Irrigation & Pumps</span>
                </Link>

                <Link
                  to="/products?category=Power+Weeder+%26+Tiller"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  className="hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <Tractor size={17} color="#16a34a" />
                  <span>Power Weeders & Tillers</span>
                </Link>

                <Link
                  to="/products?category=Sprayers+%26+Crop+Protection"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  className="hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <span>🌿</span>
                  <span>Crop Sprayers & Protection</span>
                </Link>

                <Link
                  to="/support"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  className="hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare size={17} color="#166534" />
                    <span>Support Messages & Advisory</span>
                  </div>
                  {unreadSupportCount > 0 && (
                    <span className="badge" style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.7rem', fontWeight: 900, borderRadius: '999px', padding: '0.15rem 0.45rem' }}>
                      {unreadSupportCount} NEW
                    </span>
                  )}
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  className="hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart size={17} color="#dc2626" />
                    <span>Saved Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 800 }}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  className="hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <PhoneCall size={17} color="#166534" />
                  <span>Helpline & FAQs</span>
                </Link>

                {/* All Categories Accordion Section */}
                <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-alt, #f1f5f9)', border: '1px solid var(--border-color, #cbd5e1)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', cursor: 'pointer' }}
                  >
                    <div className="flex items-center gap-2">
                      <Menu size={16} color="#166534" />
                      <span>Browse All Categories</span>
                    </div>
                    <ChevronDown size={16} style={{ transform: mobileCategoriesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>

                  {mobileCategoriesOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
                      {categoriesList.map((cat) => (
                        <Link
                          key={cat.id || cat._id}
                          to={`/products?category=${encodeURIComponent(cat.param || cat.name)}`}
                          onClick={() => setMobileDrawerOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}
                          className="hover:bg-green-50 dark:hover:bg-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            <CategoryIcon icon={cat.icon} size={16} color="#166534" />
                            <span>{cat.name}</span>
                          </div>
                          <ChevronRight size={13} color="#94a3b8" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer with Helpline & Theme */}
            <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface-alt, #f8fafc)', borderTop: '1px solid var(--border-color, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href="tel:180024743276"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#166534', color: '#ffffff', padding: '0.65rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <PhoneCall size={16} color="#86efac" />
                <span>1800-AGRI-FARM (Toll-Free)</span>
              </a>

              {/* Mobile 4-Theme Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Select Storefront Theme:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                  {THEMES.map(thm => {
                    const isCur = theme === thm.id;
                    return (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => setTheme(thm.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '8px',
                          border: isCur ? `2px solid ${thm.primaryColor}` : '1px solid var(--border-color, #cbd5e1)',
                          background: isCur ? 'var(--primary-50, rgba(22, 101, 52, 0.15))' : 'var(--bg-surface, #ffffff)',
                          color: isCur ? 'var(--primary-600, #166534)' : 'var(--text-main, #0f172a)',
                          fontSize: '0.75rem',
                          fontWeight: isCur ? 800 : 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span>{thm.icon}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thm.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Active: <strong style={{ color: 'var(--text-main)' }}>{THEMES.find(t => t.id === theme)?.name}</strong>
                </span>

                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
                  SMAM Approved ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
