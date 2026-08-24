import React, { useState, useEffect } from 'react';
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
  Award,
  MessageSquare,
  Heart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(categoriesData[0].id);
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerAnnouncements.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
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

    checkUnreadMessages();
    const interval = setInterval(checkUnreadMessages, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const activeCategory = categoriesData.find(c => c.id === selectedCatId) || categoriesData[0];
  const curTicker = tickerAnnouncements[tickerIndex];

  return (
    <header className="store-header">
      {/* 1. Dynamic Animated Center Announcement & Helpline Strip */}
      <div style={{
        background: 'linear-gradient(90deg, #05190e, #0c3e27, #05190e)',
        color: '#ffffff',
        fontSize: '0.825rem',
        padding: '0.45rem 1rem',
        borderBottom: '1px solid #14532d',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div className="container flex items-center justify-between" style={{ minHeight: '26px' }}>
          {/* Left subtle label (desktop) */}
          <div className="hidden lg:flex items-center gap-1.5" style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700 }}>
            <Sparkles size={14} color="#f59e0b" />
            <span>Kisan Priority Desk</span>
          </div>

          {/* Centered Dynamic Animated Announcement Ticker */}
          <div
            key={tickerIndex}
            className="flex items-center justify-center gap-2 flex-1 text-center"
            style={{
              animation: 'fadeInUp 0.45s ease-out forwards',
              padding: '0 0.5rem'
            }}
          >
            <span style={{ fontSize: '1rem' }}>{curTicker.icon}</span>
            <span style={{ fontWeight: 600, color: '#f8fafc', letterSpacing: '0.01em' }}>
              {curTicker.text}
            </span>
            <span
              className="badge"
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                background: '#15803d',
                color: '#fef08a',
                border: '1px solid #86efac',
                padding: '0.1rem 0.45rem',
                borderRadius: '12px'
              }}
            >
              {curTicker.highlight}
            </span>
          </div>

          {/* Right Direct Helpline Trigger */}
          <div className="flex items-center gap-3">
            <a
              href="tel:1800123456"
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
                border: '1px solid rgba(254,240,138,0.3)'
              }}
              className="hover:bg-green-900"
            >
              <PhoneCall size={12} color="#f59e0b" />
              <span>1800-AGRI-FARM</span>
            </a>

            <a
              href="https://wa.me/919027799171?text=Namaste%20AgriMachina,%20I%20need%20assistance%20with%20farm%20machinery."
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#86efac',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.775rem'
              }}
              className="hidden sm:inline-flex hover:underline"
            >
              <span>WhatsApp: +91 90277 99171</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div style={{ padding: '0.85rem 0' }}>
        <div className="container flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #125435, #166534)',
              color: '#ffffff',
              padding: '0.5rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Tractor size={26} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#062416', lineHeight: 1.1 }}>
                AGRI<span style={{ color: '#16a34a' }}>MACHINA</span>
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Farmer Direct Equipment
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1" style={{ maxWidth: '580px', display: 'flex' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Power Weeders, Solar Pumps, Earth Augers, Sprayers (e.g. AV-708)..."
                className="input-field"
                style={{ paddingLeft: '2.5rem', borderRadius: '8px 0 0 8px', borderRight: 'none' }}
              />
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0', padding: '0 1.25rem' }}>
              Search
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
                      background: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
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
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
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
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                      }}
                    >
                      <User size={15} color="#166534" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                      }}
                    >
                      <Package size={15} color="#166534" />
                      <span>My Orders & Invoices</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Heart size={15} color="#dc2626" />
                        <span>Saved Wishlist</span>
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
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare size={15} color="#166534" />
                        <span>Support Messages</span>
                      </div>
                      {unreadSupportCount > 0 && (
                        <span className="badge badge-accent" style={{ fontSize: '0.65rem', background: '#dc2626', color: '#ffffff' }}>
                          {unreadSupportCount}
                        </span>
                      )}
                    </Link>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.25rem' }}>
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
                        Logout
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
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#166534',
                  textDecoration: 'none'
                }}
                title="Farmer Login"
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

      {/* 3. Secondary Nav Bar: Clean "Categories ▾" Menu Button + Top Quick Links */}
      <nav style={{ background: '#0a3d24', color: '#ffffff', borderTop: '1px solid #14532d', position: 'relative' }}>
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
                <span>Categories</span>
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
                      background: '#f8fafc',
                      borderRight: '1px solid #e2e8f0',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      overflowY: 'auto'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '0.25rem 0.5rem', letterSpacing: '0.05em' }}>
                      All Categories ({categoriesData.length}):
                    </div>

                    {categoriesData.map((cat) => {
                      const isSelected = cat.id === activeCategory.id;
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
                            padding: '0.45rem 0.65rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: isSelected ? '#166534' : 'transparent',
                            color: isSelected ? '#ffffff' : '#1e293b',
                            fontWeight: isSelected ? 800 : 500,
                            fontSize: '0.825rem',
                            transition: 'all 0.12s ease'
                          }}
                          className={!isSelected ? 'hover:bg-slate-200' : ''}
                        >
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '1rem' }}>{cat.icon}</span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                              {cat.name}
                            </span>
                          </div>
                          <ChevronRight size={13} color={isSelected ? '#86efac' : '#94a3b8'} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column (490px): Live Dynamic Category Showcase Card */}
                  <div
                    style={{
                      flex: 1,
                      padding: '1.25rem 1.5rem',
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Title & Badge */}
                      <div className="flex justify-between items-start" style={{ marginBottom: '0.65rem' }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '1.25rem' }}>{activeCategory.icon}</span>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#062416', margin: 0 }}>
                              {activeCategory.name}
                            </h4>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', lineHeight: 1.4 }}>
                            {activeCategory.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Sub-models Tags */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          Popular Equipment Models:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCategory.subcategories.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={`/products?category=${encodeURIComponent(activeCategory.param)}`}
                              onClick={() => setIsMegaMenuOpen(false)}
                              style={{
                                fontSize: '0.75rem',
                                color: '#166534',
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: 600
                              }}
                              className="hover:bg-green-100"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Engineering Highlights */}
                      <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Zap size={13} color="#166534" />
                          <span>Engineering Specifications:</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {activeCategory.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5" style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>
                              <CheckCircle2 size={12} color="#16a34a" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Showcase Card with Image & Pricing */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #062416, #14532d)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
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
                            background: '#ffffff',
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
              🌾 All Machinery Catalog
            </Link>

            <Link
              to="/products?category=Pumps+%26+Irrigation"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dcfce7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              className="hover:text-yellow-300"
            >
              <Sun size={15} color="#f59e0b" />
              <span>Solar Irrigation</span>
            </Link>

            <Link
              to="/products?category=Power+Weeder+%26+Tiller"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dcfce7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              className="hover:text-yellow-300"
            >
              <Tractor size={15} color="#86efac" />
              <span>Power Weeders</span>
            </Link>

            <Link
              to="/products?category=Sprayers+%26+Crop+Protection"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dcfce7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              className="hover:text-yellow-300"
            >
              <span>Crop Sprayers</span>
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
              <span>Helpline & FAQs</span>
            </Link>

            <span style={{ fontSize: '0.75rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Award size={13} color="#f59e0b" />
              <span>Govt. SMAM Subsidy</span>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
