import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Timer, ShoppingCart, CreditCard, ChevronRight, Zap, Tag, Sparkles } from 'lucide-react';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const LightningDealsSection = () => {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { t, tr } = useLanguage();

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 45, seconds: 12 });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get('/products/deals');
        if (res.data.success && res.data.deals?.length > 0) {
          setDeals(res.data.deals);
        }
      } catch (err) {
        console.error('Failed to load deals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaimDeal = (product) => {
    addToCart(product, 1);
    addToast(`Flash Deal: Added ${product.name} to your cart!`, 'success');
  };

  if (loading || deals.length === 0) {
    return null;
  }

  return (
    <section className="container" style={{ marginBottom: '4rem' }}>
      {/* Luxury Obsidian & Gold Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #051c14 0%, #0d3824 50%, #166534 100%)',
          color: '#ffffff',
          borderRadius: '16px 16px 0 0',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderBottom: 'none'
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, #fbeea4, #d4af37)',
              padding: '0.5rem',
              borderRadius: '10px',
              color: '#051c14',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Zap size={20} fill="#051c14" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{t('today_deals', "Today's Super Deals & Flash Drops")}</span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  letterSpacing: '0.05em'
                }}
              >
                LIVE NOW
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#a7f3d0', marginTop: '0.15rem' }}>
              {t('free_delivery_alert', 'Limited inventory, manufacturer instant rebates & 0% No-Cost EMI')}
            </div>
          </div>
        </div>

        {/* Digital Countdown Timer */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2"
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}
          >
            <Timer size={14} color="#fbeea4" />
            <span style={{ fontSize: '0.72rem', color: '#fbeea4', fontWeight: 700 }}>
              {t('deal_ends_in', 'Offer Ends In')}:
            </span>
            <div className="flex items-center gap-1 font-mono">
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span style={{ color: '#fbeea4', fontWeight: 800 }}>:</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span style={{ color: '#fbeea4', fontWeight: 800 }}>:</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <Link
            to="/products?dealsOnly=true"
            className="flex items-center gap-1"
            style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
          >
            <span>{t('all_deals_catalog', 'View All Deals')}</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Deals Cards Container */}
      <div
        className="skeuo-card"
        style={{
          borderRadius: '0 0 20px 20px',
          borderTop: 'none',
          padding: '1.75rem 1.6rem'
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal) => {
            const isOutOfStock = deal.stockQuantity <= 0;
            const stockRemaining = Math.max(1, deal.stockQuantity || 4);
            const claimedPercent = Math.min(95, Math.max(65, 100 - stockRemaining * 5));

            return (
              <div
                key={deal._id}
                className="skeuo-card skeuo-card-interactive"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* Floating Badges */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.62rem',
                      letterSpacing: '0.04em',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    {deal.dealBadge || (deal.discountPercent > 0 ? `${deal.discountPercent}% OFF` : '⚡ FLASH DROP')}
                  </span>
                  {deal.hasExtraDiscount && deal.extraDiscountValue > 0 && (
                    <span
                      style={{
                        background: '#166534',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.62rem',
                        padding: '0.12rem 0.4rem',
                        borderRadius: '4px'
                      }}
                    >
                      {deal.extraDiscountType === 'PERCENT' ? `+${deal.extraDiscountValue}% EXTRA` : `+₹${deal.extraDiscountValue} OFF`}
                    </span>
                  )}
                </div>

                <div>
                  <Link
                    to={`/product/${deal.slug || deal._id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '175px',
                      background: 'var(--bg-surface)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      marginBottom: '0.75rem',
                      padding: '0.75rem',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <img
                      src={deal.mainImage?.url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80'}
                      alt={deal.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                      loading="lazy"
                    />
                  </Link>

                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {deal.category} • {deal.brand || 'Eidula'}
                  </div>

                  <Link to={`/product/${deal.slug || deal._id}`} style={{ textDecoration: 'none' }}>
                    <h4
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        lineHeight: 1.35,
                        minHeight: '2.3rem',
                        marginBottom: '0.35rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {tr(deal.name)}
                    </h4>
                  </Link>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-1.5" style={{ marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', letterSpacing: '-0.02em' }}>
                      {formatINR(deal.sellingPrice)}
                    </span>
                    {deal.mrp > deal.sellingPrice && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {formatINR(deal.mrp)}
                      </span>
                    )}
                  </div>

                  {/* EMI Pill */}
                  {deal.emi?.enabled && deal.emi?.minMonthlyEmi > 0 && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--primary-600, #166534)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CreditCard size={11} color="var(--primary-600, #166534)" />
                      <span>{t('monthly_emi_text', 'EMI')}: {formatINR(deal.emi.minMonthlyEmi)}/mo</span>
                    </div>
                  )}

                  {/* Claimed Progress Bar */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div className="flex justify-between" style={{ fontSize: '0.68rem', marginBottom: '0.25rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <span>{claimedPercent}% {t('claimed', 'Claimed')}</span>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>
                        {isOutOfStock ? t('out_of_stock', 'Sold Out') : `Only ${stockRemaining} left`}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${claimedPercent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #f59e0b, #dc2626)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Claim Deal Button */}
                <button
                  type="button"
                  onClick={() => handleClaimDeal(deal)}
                  disabled={isOutOfStock}
                  className="btn btn-sm"
                  style={{
                    width: '100%',
                    background: isOutOfStock
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #051c14 0%, #166534 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.45rem',
                    borderRadius: '7px',
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <ShoppingCart size={13} />
                  <span>{isOutOfStock ? t('out_of_stock', 'Sold Out') : t('claim_deal_now', 'Claim Deal Now')}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LightningDealsSection;
