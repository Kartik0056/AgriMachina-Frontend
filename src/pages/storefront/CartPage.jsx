import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Tag, CreditCard, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';
import api from '../../services/api';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    gstTotal,
    shippingFee,
    grandTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState([]);
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Fetch active database coupons for smart farmer suggestions
  useEffect(() => {
    const fetchActiveCoupons = async () => {
      try {
        const res = await api.get('/coupons/active');
        if (res.data.success) {
          setActiveCoupons(res.data.coupons || []);
        }
      } catch (err) {}
    };
    fetchActiveCoupons();
  }, []);

  const handleApplyCoupon = async (codeToApply = null) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      addToast('Please enter a coupon code.', 'warning');
      return;
    }

    setCouponLoading(true);
    try {
      const res = await api.post('/coupons/apply', {
        code,
        cartSubtotal
      });

      if (res.data.success) {
        setDiscount(res.data.discountAmount);
        setAppliedCoupon(res.data.coupon);
        setCouponCode(code);
        addToast(res.data.message || `Coupon ${code} applied successfully! You saved ${formatINR(res.data.discountAmount)}.`, 'success');
      }
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon(null);
      addToast(err.response?.data?.message || 'Invalid or expired coupon code.', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon removed.', 'info');
  };

  const finalTotal = Math.max(0, grandTotal - discount);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#f0fdf4',
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <ShoppingCart size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Explore our agricultural machinery catalog to add high-efficiency equipment.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Browse Farm Equipment</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem 1.25rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#062416', marginBottom: '1.5rem' }}>
        Shopping Cart ({cartItems.length} Machinery {cartItems.length === 1 ? 'Item' : 'Items'})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {cartItems.map(({ product, quantity }) => {
            const itemTotal = product.sellingPrice * quantity;
            return (
              <div
                key={product._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <img
                  src={product.mainImage?.url || '/images/machinery/power_weeder.jpg'}
                  alt={product.name}
                  style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '10px', background: '#f8fafc', padding: '4px' }}
                />

                <div className="flex-1" style={{ minWidth: '200px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                    {product.brand} • SKU: {product.sku}
                  </div>
                  <Link to={`/product/${product.slug || product._id}`}>
                    <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: '0.2rem 0 0.5rem 0', fontWeight: 700 }}>
                      {product.name}
                    </h4>
                  </Link>

                  <div className="flex items-center gap-4">
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#062416' }}>
                      {formatINR(product.sellingPrice)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      (Incl. {product.gstPercent || 12}% GST)
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center" style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                  <button
                    onClick={() => updateQuantity(product._id, quantity - 1)}
                    style={{ width: '30px', height: '34px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ width: '35px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product._id, quantity + 1)}
                    style={{ width: '30px', height: '34px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    {formatINR(itemTotal)}
                  </div>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', marginTop: '0.35rem' }}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Free Shipping Alert */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.85rem' }}>
            <ShieldCheck size={18} color="#22c55e" />
            <span>Eligible for <strong>Free Palletized Farm Delivery</strong> across all states in India!</span>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: '#062416', marginBottom: '1.25rem', fontWeight: 800 }}>Order Summary</h3>

          {/* Coupon Code Input & Applied State */}
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={15} color="#166534" />
              <span>Apply Discount Coupon</span>
            </label>

            {appliedCoupon ? (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '10px',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div className="flex items-center gap-1.5" style={{ color: '#166534', fontWeight: 800, fontSize: '0.85rem' }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '2px' }}>
                    You save <strong>{formatINR(discount)}</strong> on this order!
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.4rem'
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <form onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }} className="flex gap-2">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{ textTransform: 'uppercase', fontSize: '0.85rem' }}
                  />
                  <button type="submit" disabled={couponLoading} className="btn btn-secondary btn-sm" style={{ padding: '0 1rem' }}>
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </form>

                {/* Available Database Coupons Suggestions */}
                {activeCoupons.length > 0 && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.35rem', fontWeight: 600 }}>
                      Available Active Coupons:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCoupons.map((ac) => (
                        <button
                          key={ac._id}
                          type="button"
                          onClick={() => handleApplyCoupon(ac.code)}
                          style={{
                            background: '#f1f5f9',
                            border: '1px dashed #94a3b8',
                            borderRadius: '6px',
                            padding: '0.2rem 0.45rem',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: '#166534',
                            cursor: 'pointer'
                          }}
                          title={ac.description || `Get ${ac.discountType === 'PERCENT' ? `${ac.discountValue}%` : `₹${ac.discountValue}`} OFF`}
                        >
                          🏷️ {ac.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="flex flex-col gap-2.5" style={{ fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div className="flex justify-between">
              <span style={{ color: '#64748b' }}>Items Subtotal:</span>
              <span style={{ fontWeight: 600 }}>{formatINR(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#64748b' }}>Estimated GST (Included):</span>
              <span style={{ fontWeight: 600 }}>{formatINR(gstTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#64748b' }}>Farm Delivery:</span>
              <span style={{ fontWeight: 700, color: shippingFee === 0 ? '#166534' : '#0f172a' }}>
                {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between" style={{ color: '#166534', fontWeight: 700 }}>
                <span>Coupon Discount ({appliedCoupon?.code}):</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-baseline" style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#062416' }}>Grand Total:</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#062416' }}>{formatINR(finalTotal)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout', { state: { coupon: appliedCoupon, discount } })}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
