import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Landmark,
  QrCode,
  Tag,
  X,
  User,
  Mail,
  Phone,
  ArrowRight,
  LogIn,
  UserPlus,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';
import api from '../../services/api';

// Helper to ensure Razorpay checkout script is loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, gstTotal, shippingFee, clearCart } = useCart();
  const { user, isAuthenticated, login, register: registerUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Auth gate tab state ('login' or 'register')
  const [authTab, setAuthTab] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authFarmType, setAuthFarmType] = useState('Vegetable & Cotton');
  const [authLoading, setAuthLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    villageCity: '',
    district: '',
    state: 'Gujarat',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY_ONLINE'); // 'RAZORPAY_ONLINE', 'RAZORPAY_EMI', 'COD'
  const [emiTenure, setEmiTenure] = useState(6);
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [loading, setLoading] = useState(false);

  // Dynamic coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.coupon || null);
  const [couponDiscount, setCouponDiscount] = useState(location.state?.discount || 0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState([]);

  // Auto-populate address when authenticated user loads
  useEffect(() => {
    if (user) {
      const defaultAddr = (user.addresses && user.addresses.find(a => a.isDefault)) || (user.addresses && user.addresses[0]);
      setShippingAddress({
        fullName: user.name || '',
        phone: user.phone || defaultAddr?.phone || '',
        street: defaultAddr?.street || '',
        villageCity: defaultAddr?.villageCity || defaultAddr?.city || '',
        district: defaultAddr?.district || '',
        state: defaultAddr?.state || user.farmDetails?.state || 'Gujarat',
        pincode: defaultAddr?.pincode || user.farmDetails?.pincode || ''
      });
    }
  }, [user]);

  // Fetch active database coupons for recommendations
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

  // Calculate final totals with coupon discount
  const baseTotal = cartSubtotal + shippingFee;
  const grandTotal = Math.max(0, baseTotal - couponDiscount);

  // Handle inline auth submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authTab === 'login') {
        await login(authEmail, authPassword);
        addToast('Farmer login successful! You can now complete your order.', 'success');
      } else {
        await registerUser({
          name: authName,
          email: authEmail,
          phone: authPhone,
          password: authPassword,
          farmDetails: {
            farmType: authFarmType,
            farmSizeAcres: 5,
            state: shippingAddress.state || 'Gujarat'
          }
        });
        addToast('Farmer account created & logged in! 🌾', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Authentication failed. Please check your credentials.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleApplyCoupon = async (codeToApply = null) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
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
        setAppliedCoupon(res.data.coupon);
        setCouponDiscount(res.data.discountAmount);
        setCouponInput(code);
        addToast(res.data.message || `Coupon "${code}" applied! You saved ${formatINR(res.data.discountAmount)}.`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || `Coupon "${code}" is invalid or expired.`, 'warning');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput('');
    addToast('Coupon removed.', 'info');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      addToast('Farmer account login is required before placing an order.', 'warning');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.pincode) {
      addToast('Please fill in complete farm delivery address and contact details.', 'warning');
      return;
    }

    if (cartItems.length === 0) {
      addToast('Your cart is empty.', 'warning');
      return;
    }

    setLoading(true);

    try {
      // Determine mapped payment method string
      const mappedPaymentMethod = paymentMethod === 'COD' ? 'COD' : paymentMethod === 'RAZORPAY_EMI' ? 'Razorpay EMI' : 'Razorpay Online';

      // 1. Create local order record in MongoDB
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod: mappedPaymentMethod,
        couponCode: appliedCoupon?.code || '',
        couponDiscount: couponDiscount,
        emiDetails: paymentMethod === 'RAZORPAY_EMI' ? {
          isEmi: true,
          tenureMonths: emiTenure,
          monthlyEmi: Math.round(grandTotal / emiTenure),
          interestRate: 0, // 0% No Cost subvention
          downPayment: 0,
          financePartner: selectedBank
        } : { isEmi: false }
      };

      const orderRes = await api.post('/orders', orderPayload);
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to initialize order.');
      }

      const createdOrder = orderRes.data.order;

      // 2. If COD, complete immediately
      if (paymentMethod === 'COD') {
        clearCart();
        addToast('Cash on Delivery Order Placed Successfully!', 'success');
        navigate(`/order-confirmation/${createdOrder._id}`, { state: { order: createdOrder } });
        return;
      }

      // 3. Razorpay Online Payment or EMI Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not load Razorpay Payment Gateway SDK. Please check your internet connection.');
      }

      // Create Razorpay Order session on backend
      const rzpOrderRes = await api.post('/payment/razorpay/create-order', {
        amount: grandTotal,
        localOrderId: createdOrder._id,
        customerName: shippingAddress.fullName || user?.name,
        customerEmail: user?.email,
        customerPhone: shippingAddress.phone || user?.phone
      });

      if (!rzpOrderRes.data.success || !rzpOrderRes.data.razorpayOrder) {
        throw new Error('Failed to create Razorpay payment order session.');
      }

      const rzpOrder = rzpOrderRes.data.razorpayOrder;

      // Launch Razorpay Standard Checkout modal
      const options = {
        key: rzpOrder.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TSjrOFCBv53fsK',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'AgriMachina India',
        description: `Farm Equipment Order #${createdOrder.orderNumber}`,
        order_id: rzpOrder.id,
        prefill: {
          name: shippingAddress.fullName || user?.name,
          contact: shippingAddress.phone || user?.phone,
          email: user?.email
        },
        notes: {
          orderId: createdOrder._id,
          orderNumber: createdOrder.orderNumber,
          paymentPlan: paymentMethod === 'RAZORPAY_EMI' ? `EMI (${emiTenure} Months - ${selectedBank})` : 'Full Online Payment',
          couponCode: appliedCoupon?.code || 'None'
        },
        theme: {
          color: '#166534'
        },
        handler: async function (response) {
          try {
            // Verify HMAC SHA256 signature on backend
            const verifyRes = await api.post('/payment/razorpay/verify-payment', {
              localOrderId: createdOrder._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentMethod: mappedPaymentMethod
            });

            if (verifyRes.data.success) {
              clearCart();
              addToast('Razorpay payment verified successfully! Your machinery is confirmed.', 'success');
              navigate(`/order-confirmation/${createdOrder._id}`, {
                state: { order: verifyRes.data.order || createdOrder }
              });
            } else {
              addToast('Payment signature verification failed. Please contact support.', 'error');
            }
          } catch (err) {
            addToast('Error verifying payment with server.', 'error');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            addToast('Payment session cancelled. You can retry anytime.', 'warning');
            setLoading(false);
          }
        }
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.on('payment.failed', function (response) {
        addToast(`Payment failed: ${response.error.description}`, 'error');
        setLoading(false);
      });
      razorpayWindow.open();

    } catch (error) {
      addToast(error.response?.data?.message || error.message || 'Payment initiation failed.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem 1.25rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
          🚜 Secure Farm Equipment Checkout
        </span>
        <h1 style={{ fontSize: '2rem', color: '#062416', fontWeight: 900 }}>
          Machinery Order & Delivery Confirmation
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Auth Gate OR Delivery Address & Payment */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {/* STEP 1: AUTHENTICATION CHECK */}
          {!isAuthenticated ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '2px solid #86efac',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(22, 101, 52, 0.08)'
            }}>
              <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lock size={22} color="#166534" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#062416', fontWeight: 800, margin: 0 }}>
                    Step 1: Farmer Sign In Required to Confirm Order
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                    An authenticated farmer account is required to generate warranty cards, GST tax invoices, and live tracking.
                  </p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: '4px',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                gap: '4px'
              }}>
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: authTab === 'login' ? '#ffffff' : 'transparent',
                    color: authTab === 'login' ? '#166534' : '#64748b',
                    fontWeight: authTab === 'login' ? 800 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: authTab === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <LogIn size={16} />
                  <span>Existing Customer Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: authTab === 'register' ? '#ffffff' : 'transparent',
                    color: authTab === 'register' ? '#166534' : '#64748b',
                    fontWeight: authTab === 'register' ? 800 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: authTab === 'register' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <UserPlus size={16} />
                  <span>New Farmer Registration</span>
                </button>
              </div>

              {/* Quick Auth Form */}
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3.5">
                {authTab === 'register' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Farmer Full Name *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          className="input-field"
                          style={{ paddingLeft: '2.5rem' }}
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Ramesh Patel"
                        />
                        <User size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Mobile Number *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="tel"
                          required
                          className="input-field"
                          style={{ paddingLeft: '2.5rem' }}
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                        <Phone size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label className="input-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                    <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      required
                      className="input-field"
                      style={{ paddingLeft: '2.5rem' }}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  <span>{authLoading ? 'Verifying Account...' : authTab === 'login' ? 'Sign In & Continue to Address' : 'Create Account & Continue'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} color="#16a34a" />
                  <span>1-Year OEM Warranty & GST Invoice Linked</span>
                </div>
                <Link to="/login?redirect=/checkout" style={{ color: '#166534', fontWeight: 700 }}>
                  Open Full Login Page →
                </Link>
              </div>
            </div>
          ) : (
            /* Logged-In User Banner */
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#166534',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem'
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 800, color: '#062416', fontSize: '0.95rem' }}>{user?.name}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>LOGGED IN</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                    {user?.email} {user?.phone ? `• ${user.phone}` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', color: '#dc2626', borderColor: '#fca5a5' }}
                >
                  <LogOut size={13} />
                  <span>Switch Account / Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Form with Shipping Address & Payment (Interactive when Authenticated) */}
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
            {/* Shipping Address */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              opacity: !isAuthenticated ? 0.6 : 1,
              pointerEvents: !isAuthenticated ? 'none' : 'auto'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: '#062416', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="#166534" />
                <span>Farm Delivery Address</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Farmer Full Name *</label>
                  <input
                    type="text"
                    required
                    disabled={!isAuthenticated}
                    className="input-field"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    disabled={!isAuthenticated}
                    className="input-field"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="input-group md:col-span-2">
                  <label className="input-label">Farm Plot / Street Address *</label>
                  <input
                    type="text"
                    required
                    disabled={!isAuthenticated}
                    className="input-field"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    placeholder="e.g. Survey No. 42, Near Cooperative Society"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Village / Town / City *</label>
                  <input
                    type="text"
                    required
                    disabled={!isAuthenticated}
                    className="input-field"
                    value={shippingAddress.villageCity}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, villageCity: e.target.value })}
                    placeholder="e.g. Gondal"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">District *</label>
                  <input
                    type="text"
                    required
                    disabled={!isAuthenticated}
                    className="input-field"
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                    placeholder="e.g. Rajkot"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">State *</label>
                  <select
                    className="select-field"
                    disabled={!isAuthenticated}
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  >
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Bihar">Bihar</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Postal Pincode *</label>
                  <input
                    type="text"
                    required
                    disabled={!isAuthenticated}
                    className="input-field"
                    value={shippingAddress.pincode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                    placeholder="e.g. 360001"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method with Razorpay */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              opacity: !isAuthenticated ? 0.6 : 1,
              pointerEvents: !isAuthenticated ? 'none' : 'auto'
            }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#062416', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} color="#166534" />
                  <span>Select Payment Mode</span>
                </h3>
                <span className="badge badge-accent" style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.75rem' }}>
                  ⚡ Razorpay Verified
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Option 1: Razorpay Instant Online Payment */}
                <label style={{
                  border: paymentMethod === 'RAZORPAY_ONLINE' ? '2px solid #166534' : '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  background: paymentMethod === 'RAZORPAY_ONLINE' ? '#f0fdf4' : '#ffffff',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    disabled={!isAuthenticated}
                    checked={paymentMethod === 'RAZORPAY_ONLINE'}
                    onChange={() => setPaymentMethod('RAZORPAY_ONLINE')}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="flex justify-between items-center">
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                        Instant Online Payment (UPI / QR / Cards / NetBanking)
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Fast & Secure</span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem' }}>
                      Google Pay, PhonePe, Paytm, BHIM UPI, RuPay / Visa / MasterCard, and 50+ NetBanking accounts.
                    </div>
                  </div>
                </label>

                {/* Option 2: Razorpay Equipment EMI */}
                <label style={{
                  border: paymentMethod === 'RAZORPAY_EMI' ? '2px solid #166534' : '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  background: paymentMethod === 'RAZORPAY_EMI' ? '#f0fdf4' : '#ffffff',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    disabled={!isAuthenticated}
                    checked={paymentMethod === 'RAZORPAY_EMI'}
                    onChange={() => setPaymentMethod('RAZORPAY_EMI')}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="flex justify-between items-center">
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                        Kisan Equipment EMI & No-Cost Financing (Razorpay)
                      </div>
                      <span className="badge" style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.7rem', fontWeight: 700 }}>
                        0% No-Cost EMI
                      </span>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem' }}>
                      Avail 3 to 24 months installments via HDFC, SBI, ICICI, Axis, or Bajaj Finserv EMI card.
                    </div>
                  </div>
                </label>

                {/* EMI Tenure Options inside Checkout */}
                {paymentMethod === 'RAZORPAY_EMI' && (
                  <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '10px', border: '1px solid #86efac', marginLeft: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>Select Bank / Partner:</span>
                      <select
                        className="select-field"
                        disabled={!isAuthenticated}
                        style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        <option value="State Bank of India (SBI)">State Bank of India - SBI Kisan</option>
                        <option value="HDFC Bank">HDFC Bank (Credit / Debit EMI)</option>
                        <option value="ICICI Bank">ICICI Bank Credit / Debit</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Bajaj Finserv">Bajaj Finserv No-Cost EMI Card</option>
                        <option value="TVS Credit">TVS Credit Kisan Machinery</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', display: 'block', marginBottom: '0.35rem' }}>
                        Select Installment Tenure:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[3, 6, 9, 12, 18, 24].map((t) => {
                          const monthly = Math.round(grandTotal / t);
                          const isSelected = emiTenure === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              disabled={!isAuthenticated}
                              onClick={() => setEmiTenure(t)}
                              style={{
                                padding: '0.5rem 0.85rem',
                                borderRadius: '8px',
                                border: isSelected ? '2px solid #166534' : '1px solid #cbd5e1',
                                background: isSelected ? '#f0fdf4' : '#ffffff',
                                color: isSelected ? '#166534' : '#334155',
                                fontWeight: isSelected ? 800 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                              }}
                            >
                              <span style={{ fontSize: '0.85rem' }}>{t} Months {t <= 6 ? '(0% No Cost)' : ''}</span>
                              <span style={{ fontSize: '0.75rem', color: isSelected ? '#15803d' : '#64748b', fontWeight: 700 }}>
                                {formatINR(monthly)}/mo
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Option 3: COD */}
                <label style={{
                  border: paymentMethod === 'COD' ? '2px solid #166534' : '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  background: paymentMethod === 'COD' ? '#f0fdf4' : '#ffffff',
                  transition: 'all 0.15s ease'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    disabled={!isAuthenticated}
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                      Cash on Farm Delivery (COD)
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem' }}>
                      Pay in cash or UPI when machinery arrives at your farm gate.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button Inside Form */}
            {isAuthenticated && (
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', background: paymentMethod === 'COD' ? '#166534' : 'linear-gradient(135deg, #062416, #166534)', padding: '1rem' }}
              >
                <Lock size={18} />
                <span>
                  {loading
                    ? 'Connecting to Payment Gateway...'
                    : paymentMethod === 'COD'
                    ? 'Confirm Farm Delivery Order'
                    : paymentMethod === 'RAZORPAY_EMI'
                    ? `Pay via Razorpay EMI (${formatINR(Math.round(grandTotal / emiTenure))}/mo)`
                    : `Pay ${formatINR(grandTotal)} via Razorpay`}
                </span>
              </button>
            )}
          </form>
        </div>

        {/* Right Side: Order Summary Confirmation & Coupon Box */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.75rem',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: '#062416', marginBottom: '1.25rem', fontWeight: 800 }}>
            Order Items ({cartItems.length})
          </h3>

          <div className="flex flex-col gap-3" style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} className="flex items-center gap-3">
                <img
                  src={product.mainImage?.url || '/images/machinery/power_weeder.jpg'}
                  alt={product.name}
                  style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', padding: '2px' }}
                />
                <div className="flex-1" style={{ fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{product.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Qty: {quantity} x {formatINR(product.sellingPrice)}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {formatINR(product.sellingPrice * quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Promotional Coupon Application Box */}
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={15} color="#166534" />
              <span>Promotional Coupon</span>
            </div>

            {appliedCoupon ? (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
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
                  <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                    You save <strong>{formatINR(couponDiscount)}</strong>!
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field"
                    style={{ textTransform: 'uppercase', fontSize: '0.85rem', padding: '0.45rem 0.75rem', flex: 1 }}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                  />
                  <button
                    type="button"
                    disabled={couponLoading}
                    onClick={() => handleApplyCoupon()}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '0 1rem' }}
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>

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

          {/* Pricing Calculation Summary */}
          <div className="flex flex-col gap-2" style={{ fontSize: '0.9rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div className="flex justify-between">
              <span style={{ color: '#64748b' }}>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>{formatINR(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#64748b' }}>GST (Included):</span>
              <span style={{ fontWeight: 600 }}>{formatINR(gstTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#64748b' }}>Delivery Charge:</span>
              <span style={{ fontWeight: 700, color: shippingFee === 0 ? '#166534' : '#0f172a' }}>
                {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between" style={{ color: '#16a34a', fontWeight: 700 }}>
                <span>Coupon Discount ({appliedCoupon.code}):</span>
                <span>-{formatINR(couponDiscount)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-baseline" style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Payable:</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#062416' }}>{formatINR(grandTotal)}</span>
          </div>

          {!isAuthenticated && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fde047',
              borderRadius: '10px',
              padding: '0.75rem',
              color: '#854d0e',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
              <span>Please sign in or register on the left to proceed with payment and order confirmation.</span>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#166534" />
            <span>256-Bit SSL Encrypted by Razorpay Technologies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
