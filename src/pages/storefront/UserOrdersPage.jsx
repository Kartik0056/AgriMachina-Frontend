import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  Star,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  FileText,
  HelpCircle,
  Tractor,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import WriteReviewModal from '../../components/storefront/WriteReviewModal';
import api from '../../services/api';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const trackingStages = [
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Payment verified & order queued at factory' },
  { key: 'Processing', label: 'Processing & QC', desc: 'Quality inspected & wooden-crate packed' },
  { key: 'Shipped', label: 'Dispatched', desc: 'Loaded on heavy agro freight carrier' },
  { key: 'In Transit', label: 'In Transit', desc: 'Out for farm delivery from regional depot' },
  { key: 'Delivered', label: 'Delivered', desc: 'Handed over at farm gate with OEM warranty' }
];

const getStageIndex = (status) => {
  switch (status) {
    case 'Confirmed':
    case 'Pending':
      return 0;
    case 'Processing':
      return 1;
    case 'Shipped':
      return 2;
    case 'In Transit':
    case 'Out for Delivery':
      return 3;
    case 'Delivered':
      return 4;
    default:
      return 0;
  }
};

const UserOrdersPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTracking, setExpandedTracking] = useState({});
  const [reviewModalState, setReviewModalState] = useState({ isOpen: false, productId: null, productName: '' });
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!isAuthenticated && !localStorage.getItem('user_token')) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.error('Failed to load orders', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const toggleTracking = (orderId) => {
    setExpandedTracking(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleBuyAgain = (item) => {
    const productData = {
      _id: item.product?._id || item.product,
      id: item.product?._id || item.product,
      name: item.name,
      slug: item.product?.slug || item.slug || (item.product?._id || item.product),
      sellingPrice: item.price,
      price: item.price,
      mrp: item.price,
      mainImage: { url: item.image || item.product?.mainImage?.url }
    };

    addToCart(productData, item.quantity || 1);
    addToast(`Added ${item.name} to Cart! 🛒`, 'success');
  };

  const handleReorderEntireOrder = (order) => {
    order.items.forEach(item => {
      handleBuyAgain(item);
    });
    addToast(`All ${order.items.length} machines added to cart!`, 'success');
    navigate('/cart');
  };

  const openReviewModal = (productId, productName) => {
    setReviewModalState({
      isOpen: true,
      productId,
      productName
    });
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '3.5rem 2rem',
          maxWidth: '520px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#f0fdf4',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Package size={34} color="#166534" />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#062416', fontWeight: 900, marginBottom: '0.5rem' }}>
            Farmer Account Required
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.925rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            Please sign in to your verified farmer account to track your machinery dispatches, download GST tax invoices, and access product warranties.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/login?redirect=/orders" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <span>Sign In / Create Farmer Account</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-secondary btn-md" style={{ width: '100%' }}>
              <span>Browse Farm Machinery Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem 1.25rem' }}>
      {/* Farmer Account Header Banner */}
      {user && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: '#166534' }}>
            <ShieldCheck size={18} color="#16a34a" />
            <span>Orders for verified farmer: <strong>{user.name}</strong> ({user.email})</span>
          </div>
          <Link to="/profile" style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, textDecoration: 'underline' }}>
            Farmer Profile & Addresses →
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            🚜 Farm Equipment History
          </span>
          <h1 style={{ fontSize: '2rem', color: '#062416', fontWeight: 900 }}>
            My Orders & Live Shipment Tracking
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Live step-by-step GPS logistics tracking, GST invoice downloads, and verified farm reviews.
          </p>
        </div>

        <Link to="/products" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Tractor size={16} color="#166534" />
          <span>Browse Machinery Catalog</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          Loading your farm equipment orders...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <Package size={52} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800, marginBottom: '0.5rem' }}>
            No Farm Equipment Orders Placed Yet
          </h3>
          <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            You haven't placed any machinery orders with this account yet. Browse our catalog with 0% No-Cost EMI & DBT Subsidies.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Machinery Catalog
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const isDelivered = order.orderStatus === 'Delivered';
            const currentStageIdx = getStageIndex(order.orderStatus);
            const isExpanded = !!expandedTracking[order._id];
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div
                key={order._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                {/* Order Top Bar */}
                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#062416' }}>
                        Order #{order.orderNumber}
                      </span>
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'badge-success' :
                        order.orderStatus === 'Shipped' || order.orderStatus === 'In Transit' ? 'badge-info' :
                        order.orderStatus === 'Confirmed' ? 'badge-primary' : 'badge-warning'
                      }`}>
                        {order.orderStatus === 'Delivered' && <CheckCircle2 size={13} />}
                        {(order.orderStatus === 'Shipped' || order.orderStatus === 'In Transit') && <Truck size={13} />}
                        {order.orderStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Placed on {orderDate} • {order.items?.length || 1} Machine(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#062416' }}>
                        {formatINR(order.pricing?.grandTotal || 0)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
                        {order.payment?.method || 'Online Payment'} ({order.payment?.status || 'Paid'})
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReorderEntireOrder(order)}
                      className="btn btn-secondary btn-sm"
                      style={{ background: '#f0fdf4', borderColor: '#86efac', color: '#166534', fontWeight: 700 }}
                      title="Reorder all machines in this order"
                    >
                      <RotateCcw size={14} />
                      <span className="hidden sm:inline">Reorder All</span>
                    </button>
                  </div>
                </div>

                {/* 🚚 LIVE STEP-BY-STEP TRACKING STEPPER BAR */}
                <div style={{
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className="flex items-center gap-2">
                      <Truck size={18} color="#166534" />
                      <span style={{ fontWeight: 800, color: '#062416', fontSize: '0.9rem' }}>
                        Live Shipment Status: <span style={{ color: '#16a34a' }}>{order.orderStatus}</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTracking(order._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <span>{isExpanded ? 'Hide Milestone Details' : 'View Full Logistics Timeline'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* 5-Step Visual Track */}
                  <div style={{ position: 'relative', margin: '1rem 0 0.5rem 0' }}>
                    {/* Connecting Background Line */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '5%',
                      right: '5%',
                      height: '4px',
                      background: '#cbd5e1',
                      zIndex: 1
                    }}>
                      {/* Active Green Progress Line */}
                      <div style={{
                        height: '100%',
                        background: '#16a34a',
                        width: `${(currentStageIdx / (trackingStages.length - 1)) * 100}%`,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>

                    {/* Stage Nodes */}
                    <div className="flex justify-between" style={{ position: 'relative', zIndex: 2 }}>
                      {trackingStages.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '18%', textAlign: 'center' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isCompleted ? '#166534' : '#ffffff',
                              border: isCurrent ? '3px solid #34d399' : isCompleted ? '2px solid #166534' : '2px solid #cbd5e1',
                              color: isCompleted ? '#ffffff' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              boxShadow: isCurrent ? '0 0 0 4px rgba(34, 197, 94, 0.25)' : 'none',
                              marginBottom: '0.4rem',
                              transition: 'all 0.3s ease'
                            }}>
                              {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                              color: isCurrent ? '#166534' : isCompleted ? '#0f172a' : '#94a3b8',
                              lineHeight: 1.2
                            }}>
                              {stage.label}
                            </div>
                            <div className="hidden md:block" style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem' }}>
                              {stage.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expandable Detailed Timeline */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e2e8f0',
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '1rem'
                    }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div>
                          Carrier Partner: <strong>{order.tracking?.courierName || 'AgriLogistics Heavy Freight'}</strong>
                        </div>
                        <div>
                          Waybill / LR No: <strong style={{ color: '#166534' }}>{order.tracking?.trackingNumber || `AGX-${order.orderNumber.replace(/[^0-9]/g, '')}`}</strong>
                        </div>
                        <div>
                          Estimated Delivery: <strong>{order.tracking?.estimatedDelivery ? new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN') : 'Within 3-5 Working Days'}</strong>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5" style={{ fontSize: '0.785rem', color: '#334155' }}>
                        <div className="flex items-start gap-2">
                          <MapPin size={15} color="#166534" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                          <div>
                            <strong>Dispatched from Central Warehouse:</strong> Agro Manufacturing Zone, Rajkot, Gujarat (Chassis & Engine verified)
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Truck size={15} color="#166534" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                          <div>
                            <strong>In Transit:</strong> Heavy pallet container on route via Hydraulic tail-lift transport
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={15} color={isDelivered ? '#166534' : '#94a3b8'} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                          <div>
                            <strong>Farm Gate Handover:</strong> Delivered with OEM toolkit, user manual, and verified GST invoice.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Machine Items in this Order (Clickable to jump to Product Page + Buy Again) */}
                <div className="flex flex-col gap-3">
                  {order.items.map((item, idx) => {
                    const productId = item.product?._id || item.product;
                    const productSlug = item.product?.slug || item.slug || productId;
                    const isAlreadyReviewed = order.reviewedProductIds?.includes(productId);

                    return (
                      <div
                        key={idx}
                        style={{
                          background: '#f8fafc',
                          borderRadius: '12px',
                          padding: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          border: '1px solid #f1f5f9'
                        }}
                      >
                        {/* Clickable Product Thumbnail */}
                        <Link
                          to={`/product/${productSlug}`}
                          style={{ textDecoration: 'none', display: 'block' }}
                          title={`View ${item.name} specifications`}
                        >
                          <img
                            src={item.image || item.product?.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=200&q=80'}
                            alt={item.name}
                            style={{ width: '70px', height: '70px', objectFit: 'contain', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '0.25rem' }}
                            className="hover:scale-105 transition-transform"
                          />
                        </Link>

                        {/* Clickable Product Info */}
                        <div className="flex-1" style={{ minWidth: '220px' }}>
                          <Link
                            to={`/product/${productSlug}`}
                            style={{
                              fontWeight: 800,
                              color: '#0f172a',
                              fontSize: '0.95rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                            className="hover:text-green-700 hover:underline"
                          >
                            <span>{item.name}</span>
                            <ExternalLink size={13} color="#64748b" />
                          </Link>

                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                            SKU: <strong>{item.sku}</strong> • Qty: <strong>{item.quantity}</strong> • Unit Price: {formatINR(item.price)}
                          </div>
                        </div>

                        {/* Actions: Buy Again & Rate/Review */}
                        <div className="flex items-center gap-2.5">
                          {/* 1-Click Buy Again Button */}
                          <button
                            type="button"
                            onClick={() => handleBuyAgain(item)}
                            className="btn btn-secondary btn-sm"
                            style={{ background: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', fontWeight: 700 }}
                            title="Add this machinery again to Cart"
                          >
                            <RotateCcw size={14} color="#166534" />
                            <span>Buy Again</span>
                          </button>

                          {/* Rate & Review Action */}
                          {isDelivered ? (
                            isAlreadyReviewed ? (
                              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CheckCircle2 size={13} /> Reviewed
                              </span>
                            ) : (
                              <button
                                onClick={() => openReviewModal(productId, item.name)}
                                className="btn btn-accent btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                              >
                                <Star size={14} fill="#ffffff" />
                                <span>Rate & Review</span>
                              </button>
                            )
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={13} /> Review unlocks after delivery
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Address & Customer Support Action */}
                <div style={{
                  marginTop: '1.25rem',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.85rem',
                  fontSize: '0.8rem',
                  color: '#64748b',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} color="#166534" />
                    <span>
                      Farm Delivery: <strong>{order.shippingAddress?.fullName || 'Farmer'}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to="/support" className="flex items-center gap-1 text-green-800 hover:underline" style={{ fontWeight: 700 }}>
                      <HelpCircle size={14} color="#166534" />
                      <span>Need Help with Order?</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={reviewModalState.isOpen}
        onClose={() => setReviewModalState({ isOpen: false, productId: null, productName: '' })}
        productId={reviewModalState.productId}
        productName={reviewModalState.productName}
        onReviewSubmitted={fetchOrders}
      />
    </div>
  );
};

export default UserOrdersPage;
