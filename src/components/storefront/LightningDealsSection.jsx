import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Timer, ShoppingCart, CreditCard, ChevronRight, Zap, Tag } from 'lucide-react';
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
    addToast(`Lightning Deal: Added ${product.name} to your cart!`, 'success');
  };

  if (loading || deals.length === 0) {
    return null;
  }

  return (
    <section className="container" style={{ marginBottom: '4rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7c2d12, #991b1b)',
          color: '#ffffff',
          borderRadius: '16px 16px 0 0',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ background: '#f59e0b', padding: '0.45rem', borderRadius: '8px', color: '#ffffff' }}>
            <Zap size={22} fill="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{t('today_deals', "Today's Super Deals & Hot Offers")}</span>
              <span className="badge" style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.7rem' }}>LIVE</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#fecaca', marginTop: '0.2rem' }}>
              {t('free_delivery_alert', 'Limited-quantity farmer discounts, subsidy rebates & 0% No-Cost EMI')}
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Timer size={16} color="#fef08a" />
            <span style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 700 }}>{t('deal_ends_in', 'Ends in')}:</span>
            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em' }}>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          <Link to="/products?dealsOnly=true" className="flex items-center gap-1" style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>{t('all_machinery_catalog', 'See All Deals')}</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Deals Cards Grid */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRadius: '0 0 16px 16px',
          border: '1px solid var(--border-color)',
          borderTop: 'none',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal) => {
            const isOutOfStock = deal.stockQuantity <= 0;
            const stockRemaining = Math.max(1, deal.stockQuantity || 4);
            const claimedPercent = Math.min(95, Math.max(60, 100 - (stockRemaining * 5)));

            return (
              <div
                key={deal._id}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'var(--bg-surface-alt)',
                  position: 'relative'
                }}
              >
                {/* Floating Badges */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span className="badge" style={{ background: '#dc2626', color: '#ffffff', fontWeight: 900, fontSize: '0.68rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {deal.dealBadge || (deal.discountPercent > 0 ? `${deal.discountPercent}% OFF DEAL` : '🔥 HOT DEAL')}
                  </span>
                  {deal.hasExtraDiscount && deal.extraDiscountValue > 0 && (
                    <span className="badge" style={{ background: '#15803d', color: '#ffffff', fontWeight: 800, fontSize: '0.65rem' }}>
                      {deal.extraDiscountType === 'PERCENT' ? `🎁 Extra ${deal.extraDiscountValue}% OFF` : `🎁 Extra ₹${deal.extraDiscountValue} OFF`}
                    </span>
                  )}
                </div>

                <div>
                  <Link to={`/product/${deal.slug || deal._id}`} style={{ display: 'block', height: '180px', background: 'var(--bg-surface)', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <img
                      src={deal.mainImage?.url || '/images/machinery/power_weeder.jpg'}
                      alt={deal.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}
                    />
                  </Link>

                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    {deal.category} • {deal.brand}
                  </div>

                  <Link to={`/product/${deal.slug || deal._id}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3, minHeight: '2.4rem', marginBottom: '0.4rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {tr(deal.name)}
                    </h4>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2" style={{ marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#dc2626' }}>
                      {formatINR(deal.sellingPrice)}
                    </span>
                    {deal.mrp > deal.sellingPrice && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {formatINR(deal.mrp)}
                      </span>
                    )}
                  </div>

                  {/* Extra Discount Label */}
                  {deal.hasExtraDiscount && deal.extraDiscountLabel && (
                    <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Tag size={12} color="#15803d" />
                      <span>{deal.extraDiscountLabel}</span>
                    </div>
                  )}

                  {/* EMI */}
                  {deal.emi?.enabled && deal.emi?.minMonthlyEmi > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-600, #166534)', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CreditCard size={13} color="#166534" />
                      <span>{t('monthly_emi_text', 'EMI')}: <strong>{formatINR(deal.emi.minMonthlyEmi)}/mo</strong></span>
                    </div>
                  )}

                  {/* Claim Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div className="flex justify-between text-xs" style={{ marginBottom: '0.25rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <span>{claimedPercent}% {t('claimed', 'Claimed')}</span>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>
                        {isOutOfStock ? t('out_of_stock', 'Sold Out') : `Only ${stockRemaining} left`}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '7px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${claimedPercent}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #ea580c, #dc2626)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleClaimDeal(deal)}
                  disabled={isOutOfStock}
                  className="btn btn-primary btn-sm"
                  style={{
                    width: '100%',
                    background: isOutOfStock ? '#94a3b8' : 'linear-gradient(135deg, #ea580c, #c2410c)',
                    borderColor: isOutOfStock ? '#94a3b8' : '#c2410c',
                    cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ShoppingCart size={15} />
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
