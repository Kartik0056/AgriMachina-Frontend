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
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import WriteReviewModal from '../../components/storefront/WriteReviewModal';
import api from '../../services/api';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedTracking, setExpandedTracking] = useState({});
  const [reviewModalState, setReviewModalState] = useState({ isOpen: false, productId: null, productName: '' });
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { subscribe } = useSync();
  const navigate = useNavigate();

  const fetchOrders = async (showToastOnRefresh = false, isBackground = false) => {
    if (!isAuthenticated && !localStorage.getItem('user_token')) {
      setOrders([]);
      setLoading(false);
      return;
    }
    try {
      if (showToastOnRefresh) setIsRefreshing(true);
      else if (!isBackground) setLoading(true);

      const res = await api.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
        if (showToastOnRefresh) {
          addToast('Orders refreshed with latest live status!', 'success');
        }
      }
    } catch (error) {
      console.error('Failed to load orders', error);
      if (!isBackground) setOrders([]);
      if (showToastOnRefresh) {
        addToast('Failed to refresh orders. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, user, authLoading]);

  // Live real-time sync for order updates
  useEffect(() => {
    if (!subscribe) return;
    const unsubscribe = subscribe((event) => {
      if (event.type === 'ORDER_STATUS_CHANGED') {
        const { orderId, orderNumber, newStatus, tracking, payment } = event.payload || event.data || {};

        setOrders((prevOrders) => {
          const matchIndex = prevOrders.findIndex(
            (o) => o._id === orderId || o.orderNumber === orderNumber
          );
          if (matchIndex !== -1) {
            const updated = [...prevOrders];
            const currentOrder = { ...updated[matchIndex] };
            if (newStatus) currentOrder.orderStatus = newStatus;
            if (tracking) {
              currentOrder.tracking = {
                ...currentOrder.tracking,
                ...tracking,
                statusUpdates: tracking.statusUpdates || currentOrder.tracking?.statusUpdates
              };
            }
            if (payment) {
              currentOrder.payment = { ...currentOrder.payment, ...payment };
            }
            updated[matchIndex] = currentOrder;
            return updated;
          }
          return prevOrders;
        });

        // Trigger notification
        if (orderNumber) {
          addToast(`🚚 Live Status Update: Order #${orderNumber} is now "${newStatus}"!`, 'info');
        }

        // Background refetch to guarantee integrity
        fetchOrders(false, true);
      } else if (event.type === 'ORDER_CREATED' || event.type === 'ORDER_UPDATED') {
        fetchOrders(false, true);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribe]);

  const toggleTracking = (orderId) => {
    setExpandedTracking(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleBuyAgain = (item) => {
    if (!item) return;
    const productData = {
      _id: item.product?._id || item.product || item.id || item._id,
      id: item.product?._id || item.product || item.id || item._id,
      name: item.name || item.product?.name || 'Agricultural Machine',
      slug: item.product?.slug || item.slug || (item.product?._id || item.product),
      sellingPrice: item.price || item.product?.sellingPrice || 0,
      price: item.price || item.product?.sellingPrice || 0,
      mrp: item.mrp || item.price || item.product?.mrp || 0,
      mainImage: { url: item.image || item.product?.mainImage?.url || '/images/machinery/power_weeder.jpg' }
    };

    addToCart(productData, item.quantity || 1);
    addToast(`Added ${productData.name} to Cart! 🛒`, 'success');
  };

  const handleReorderEntireOrder = (order) => {
    if (!order || !Array.isArray(order.items)) return;
    order.items.forEach(item => {
      if (item) handleBuyAgain(item);
    });
    addToast(`All ${order.items.length} machines added to cart!`, 'success');
    navigate('/cart');
  };

  const openReviewModal = (productId, productName) => {
    setReviewModalState({
      isOpen: true,
      productId,
      productName: productName || 'Machinery'
    });
  };

  if (!isAuthenticated && !authLoading) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '3.5rem 2rem',
          maxWidth: '520px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Package size={34} color="var(--primary-600)" />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 900, marginBottom: '0.5rem' }}>
            Farmer Account Required
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '2rem', lineHeight: 1.5 }}>
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
          background: 'var(--primary-50)',
          border: '1px solid var(--primary-400, #86efac)',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>
            <ShieldCheck size={18} color="var(--primary-500)" />
            <span>Orders for verified farmer: <strong>{user.name}</strong> ({user.email})</span>
          </div>
          <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--primary-500)', fontWeight: 700, textDecoration: 'underline' }}>
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
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: 900 }}>
            My Orders & Live Shipment Tracking
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live step-by-step GPS logistics tracking, GST invoice downloads, and verified farm reviews.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchOrders(true)}
            disabled={loading || isRefreshing}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Refresh order statuses"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} color="var(--primary-600)" />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Orders'}</span>
          </button>

          <Link to="/products" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tractor size={16} color="var(--primary-600)" />
            <span>Browse Machinery Catalog</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem auto', color: 'var(--primary-600)' }} />
          <div>Loading your farm equipment orders...</div>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Package size={52} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.5rem' }}>
            No Farm Equipment Orders Placed Yet for {user?.name || 'Your Account'}
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 1.5rem auto' }}>
            You haven't placed any machinery orders with <strong>{user?.email}</strong> yet. Browse our catalog with 0% No-Cost EMI & DBT Subsidies.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Machinery Catalog
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            if (!order) return null;
            const isDelivered = order.orderStatus === 'Delivered';
            const currentStageIdx = getStageIndex(order.orderStatus || 'Confirmed');
            const isExpanded = !!expandedTracking[order._id];
            const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
            const orderNumberDisplay = order.orderNumber || (order._id ? `AG-${String(order._id).slice(-8)}` : 'AG-ORDER');
            const itemsList = Array.isArray(order.items) ? order.items : [];

            return (
              <div
                key={order._id || Math.random()}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  padding: '1.5rem',
                  boxShadow: 'var(--card-shadow, 0 4px 6px -1px rgba(0,0,0,0.05))',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                {/* Order Top Bar */}
                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        Order #{orderNumberDisplay}
                      </span>
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'badge-success' :
                        order.orderStatus === 'Shipped' || order.orderStatus === 'In Transit' ? 'badge-info' :
                        order.orderStatus === 'Confirmed' ? 'badge-primary' : 'badge-warning'
                      }`}>
                        {order.orderStatus === 'Delivered' && <CheckCircle2 size={13} />}
                        {(order.orderStatus === 'Shipped' || order.orderStatus === 'In Transit') && <Truck size={13} />}
                        {order.orderStatus || 'Confirmed'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Placed on {orderDate} • {itemsList.length} Machine(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        {formatINR(order.pricing?.grandTotal || 0)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700 }}>
                        {order.payment?.method || 'Online Payment'} ({order.payment?.status || 'Paid'})
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReorderEntireOrder(order)}
                      className="btn btn-secondary btn-sm"
                      style={{ background: 'var(--primary-50)', borderColor: 'var(--primary-400, #86efac)', color: 'var(--primary-600)', fontWeight: 700 }}
                      title="Reorder all machines in this order"
                    >
                      <RotateCcw size={14} />
                      <span className="hidden sm:inline">Reorder All</span>
                    </button>
                  </div>
                </div>

                {/* 🚚 LIVE STEP-BY-STEP TRACKING STEPPER BAR */}
                <div style={{
                  background: 'var(--bg-surface-alt)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className="flex items-center gap-2">
                      <Truck size={18} color="var(--primary-600)" />
                      <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        Live Shipment Status: <span style={{ color: 'var(--primary-500)' }}>{order.orderStatus || 'Confirmed'}</span>
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
                      background: 'var(--border-color)',
                      zIndex: 1
                    }}>
                      {/* Active Green Progress Line */}
                      <div style={{
                        height: '100%',
                        background: 'var(--primary-500, #16a34a)',
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
                              background: isCompleted ? 'var(--primary-600, #166534)' : 'var(--bg-surface)',
                              border: isCurrent ? '3px solid var(--primary-400)' : isCompleted ? '2px solid var(--primary-600)' : '2px solid var(--border-color)',
                              color: isCompleted ? '#ffffff' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              boxShadow: isCurrent ? '0 0 0 4px var(--primary-100, rgba(34, 197, 94, 0.25))' : 'none',
                              marginBottom: '0.4rem',
                              transition: 'all 0.3s ease'
                            }}>
                              {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                              color: isCurrent ? 'var(--primary-600)' : isCompleted ? 'var(--text-main)' : 'var(--text-light)',
                              lineHeight: 1.2
                            }}>
                              {stage.label}
                            </div>
                            <div className="hidden md:block" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
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
                      borderTop: '1px solid var(--border-color)',
                      background: 'var(--bg-surface)',
                      borderRadius: '8px',
                      padding: '1rem'
                    }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                        <div>
                          Carrier Partner: <strong>{order.tracking?.courierName || 'AgriLogistics Heavy Freight'}</strong>
                        </div>
                        <div>
                          Waybill / LR No: <strong style={{ color: 'var(--primary-600)' }}>
                            {order.tracking?.trackingNumber || (order.orderNumber ? `AGX-${String(order.orderNumber).replace(/[^0-9]/g, '')}` : `AGX-${String(order._id || '').slice(-6)}`)}
                          </strong>
                        </div>
                        <div>
                          Estimated Delivery: <strong>{order.tracking?.estimatedDelivery ? (isNaN(new Date(order.tracking.estimatedDelivery).getTime()) ? String(order.tracking.estimatedDelivery) : new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN')) : 'Within 3-5 Working Days'}</strong>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5" style={{ fontSize: '0.785rem', color: 'var(--text-main)' }}>
                        <div className="flex items-start gap-2">
                          <MapPin size={15} color="var(--primary-600)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                          <div>
                            <strong>Dispatched from Central Warehouse:</strong> Agro Manufacturing Zone, Rajkot, Gujarat (Chassis & Engine verified)
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Truck size={15} color="var(--primary-600)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                          <div>
                            <strong>In Transit:</strong> Heavy pallet container on route via Hydraulic tail-lift transport
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={15} color={isDelivered ? 'var(--primary-600)' : 'var(--text-light)'} style={{ marginTop: '0.15rem', flexShrink: 0 }} />
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
                  {itemsList.map((item, idx) => {
                    if (!item) return null;
                    const productId = item.product?._id || item.product || item.id || item._id;
                    const productSlug = item.product?.slug || item.slug || productId;
                    const isAlreadyReviewed = Array.isArray(order.reviewedProductIds) && productId && order.reviewedProductIds.includes(productId);
                    const itemName = item.name || item.product?.name || 'Machinery Product';
                    const itemSku = item.sku || item.product?.sku || 'AG-PROD';
                    const itemQty = item.quantity || 1;
                    const itemPrice = item.price || item.product?.sellingPrice || 0;
                    const itemImage = item.image || item.product?.mainImage?.url || '/images/machinery/power_weeder.jpg';

                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-surface-alt)',
                          borderRadius: '12px',
                          padding: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        {/* Clickable Product Thumbnail */}
                        <Link
                          to={productSlug ? `/product/${productSlug}` : '/products'}
                          style={{ textDecoration: 'none', display: 'block' }}
                          title={`View ${itemName} specifications`}
                        >
                          <img
                            src={itemImage}
                            alt={itemName}
                            style={{ width: '70px', height: '70px', objectFit: 'contain', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '0.25rem' }}
                            className="hover:scale-105 transition-transform"
                          />
                        </Link>

                        {/* Clickable Product Info */}
                        <div className="flex-1" style={{ minWidth: '220px' }}>
                          <Link
                            to={productSlug ? `/product/${productSlug}` : '/products'}
                            style={{
                              fontWeight: 800,
                              color: 'var(--text-main)',
                              fontSize: '0.95rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                            className="hover:text-green-700 hover:underline"
                          >
                            <span>{itemName}</span>
                            <ExternalLink size={13} color="var(--text-muted)" />
                          </Link>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            SKU: <strong>{itemSku}</strong> • Qty: <strong>{itemQty}</strong> • Unit Price: {formatINR(itemPrice)}
                          </div>
                        </div>

                        {/* Actions: Buy Again & Rate/Review */}
                        <div className="flex items-center gap-2.5">
                          {/* 1-Click Buy Again Button */}
                          <button
                            type="button"
                            onClick={() => handleBuyAgain(item)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontWeight: 700 }}
                            title="Add this machinery again to Cart"
                          >
                            <RotateCcw size={14} color="var(--primary-600)" />
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
                                onClick={() => openReviewModal(productId, itemName)}
                                className="btn btn-accent btn-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                              >
                                <Star size={14} fill="#ffffff" />
                                <span>Rate & Review</span>
                              </button>
                            )
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.85rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} color="var(--primary-600)" />
                    <span>
                      Farm Delivery: <strong>
                        {order.shippingAddress?.fullName || order.customerName || user?.name || 'Farmer'}
                        {order.shippingAddress?.villageCity || order.shippingAddress?.city ? `, ${order.shippingAddress.villageCity || order.shippingAddress.city}` : ''}
                        {order.shippingAddress?.district ? `, ${order.shippingAddress.district}` : ''}
                        {order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}
                        {order.shippingAddress?.pincode ? ` - ${order.shippingAddress.pincode}` : ''}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to="/support" className="flex items-center gap-1 hover:underline" style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                      <HelpCircle size={14} color="var(--primary-600)" />
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

class OrdersErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in UserOrdersPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            padding: '3rem 2rem',
            maxWidth: '520px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <Package size={48} color="var(--primary-600)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.5rem' }}>
              My Orders & Live Logistics
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              There was a minor hiccup loading order tracking. Please click below to refresh your live orders.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="btn btn-primary btn-md"
              >
                <RefreshCw size={16} />
                <span>Reload Orders</span>
              </button>
              <Link to="/products" className="btn btn-secondary btn-md">
                Browse Machinery
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SafeUserOrdersPage = (props) => (
  <OrdersErrorBoundary>
    <UserOrdersPage {...props} />
  </OrdersErrorBoundary>
);

export default SafeUserOrdersPage;

