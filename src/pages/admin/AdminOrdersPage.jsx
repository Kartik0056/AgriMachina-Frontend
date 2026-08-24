import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Truck,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  RefreshCw,
  Search,
  User,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Status update form in modal
  const [newStatus, setNewStatus] = useState('');
  const [courierName, setCourierName] = useState('AgriLogistics Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await adminApi.get('/orders', {
        params: { status: statusFilter, search: searchQuery }
      });
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      if (!isBackground) {
        addToast('Failed to load orders from database', 'error');
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);


  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || 'Confirmed');
    setCourierName(order.tracking?.courierName || 'AgriLogistics Express');
    setTrackingNumber(order.tracking?.trackingNumber || '');
    setStatusNote('');
    setIsDetailModalOpen(true);
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await adminApi.put(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        note: statusNote || `Order status updated to ${newStatus}`,
        courierName,
        trackingNumber
      });

      if (res.data.success) {
        addToast(`Order #${selectedOrder.orderNumber} updated to ${newStatus}!`, 'success');
        setIsDetailModalOpen(false);
        fetchOrders();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.pricing?.grandTotal || 0), 0);
  const confirmedCount = orders.filter(o => o.orderStatus === 'Confirmed').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={24} color="#34d399" />
            <span>Customer Machinery Orders & Live Dispatch Management</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            View live incoming farmer machinery orders, manage dispatch status, track logistics, and record payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`btn btn-sm ${autoRefresh ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <RefreshCw size={13} className={autoRefresh ? 'animate-spin' : ''} />
            <span>{autoRefresh ? 'Live Auto-Sync (8s ON)' : 'Auto-Sync Paused'}</span>
          </button>

          <button
            onClick={() => fetchOrders()}
            className="btn btn-secondary btn-sm"
            style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
          >
            <RefreshCw size={14} />
            <span>Refresh Now</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Order Volume</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>{totalOrders} Orders</span>
          <span style={{ fontSize: '0.7rem', color: '#34d399' }}>Total Gross: {formatINR(totalRevenue)}</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Confirmed (To Pack)</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#60a5fa' }}>{confirmedCount} Orders</span>
          <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Ready for warehouse palletizing</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Shipped (In Transit)</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fef08a' }}>{shippedCount} Shipments</span>
          <span style={{ fontSize: '0.7rem', color: '#fde047' }}>En route to farmer address</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Delivered & Verified</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>{deliveredCount} Delivered</span>
          <span style={{ fontSize: '0.7rem', color: '#86efac' }}>100% Fulfilled</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card flex justify-between items-center" style={{ padding: '0.85rem 1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginRight: '0.25rem' }}>Status:</span>
          {['', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                background: statusFilter === st ? '#166534' : '#0b1324',
                borderColor: statusFilter === st ? '#22c55e' : '#1e2e4f',
                color: '#ffffff',
                fontSize: '0.75rem',
                padding: '0.3rem 0.7rem'
              }}
            >
              {st === '' ? 'All Orders' : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff', paddingLeft: '2.2rem', fontSize: '0.825rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order #, Farmer Name, Phone..."
          />
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Farmer Profile</th>
                <th>Farm Equipment Items</th>
                <th>Farm Location</th>
                <th>Payment Mode</th>
                <th>Total Value</th>
                <th>Order Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading incoming machinery orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag size={36} color="#334155" />
                      <span style={{ fontSize: '1rem', color: '#cbd5e1', fontWeight: 600 }}>No machinery orders found</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>When customers place orders from the store, they will appear here in real time.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    {/* Order # */}
                    <td>
                      <strong style={{ color: '#ffffff', fontSize: '0.9rem' }}>#{order.orderNumber}</strong>
                    </td>

                    {/* Farmer */}
                    <td>
                      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem' }}>
                        {order.shippingAddress?.fullName || order.customerName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {order.shippingAddress?.phone || order.customerPhone}
                      </div>
                    </td>

                    {/* Items */}
                    <td style={{ maxWidth: '240px' }}>
                      <div className="flex flex-col gap-1">
                        {order.items.map((i, idx) => (
                          <div key={idx} style={{ fontSize: '0.8rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            • {i.name} <strong style={{ color: '#34d399' }}>(x{i.quantity})</strong>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Destination */}
                    <td>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                        {order.shippingAddress?.villageCity}, {order.shippingAddress?.district}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>
                        {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </div>
                    </td>

                    {/* Payment Mode */}
                    <td>
                      <span className={`badge ${
                        order.payment?.method?.includes('EMI') ? 'badge-warning' :
                        order.payment?.method?.includes('Online') ? 'badge-success' : 'badge-primary'
                      }`} style={{ fontSize: '0.7rem' }}>
                        {order.payment?.method || 'COD'}
                      </span>
                      {order.pricing?.couponCode && (
                        <div style={{ fontSize: '0.675rem', color: '#86efac', marginTop: '2px' }}>
                          🎟️ {order.pricing.couponCode}
                        </div>
                      )}
                    </td>

                    {/* Total Value */}
                    <td>
                      <div style={{ fontWeight: 900, color: '#34d399', fontSize: '0.95rem' }}>
                        {formatINR(order.pricing?.grandTotal || 0)}
                      </div>
                      {order.pricing?.discountTotal > 0 && (
                        <div style={{ fontSize: '0.675rem', color: '#fca5a5' }}>
                          Saved {formatINR(order.pricing.discountTotal)}
                        </div>
                      )}
                    </td>

                    {/* Order Status Badge */}
                    <td>
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'badge-success' :
                        order.orderStatus === 'Shipped' ? 'badge-info' :
                        order.orderStatus === 'Confirmed' ? 'badge-primary' :
                        order.orderStatus === 'Cancelled' ? 'badge-danger' : 'badge-warning'
                      }`} style={{ fontSize: '0.725rem' }}>
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => openOrderModal(order)}
                        className="btn btn-secondary btn-sm"
                        style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff', padding: '0.35rem 0.75rem' }}
                      >
                        <Eye size={14} />
                        <span>Manage Status</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Manage & Status Update Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content dark-theme" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            {/* Header */}
            <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #1e2e4f', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', margin: 0 }}>
                  Manage Order #{selectedOrder.orderNumber}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                Status: {selectedOrder.orderStatus}
              </span>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="flex flex-col gap-4">
              {/* Farmer & Delivery Address */}
              <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  🚜 Farmer & Delivery Details:
                </div>
                <div className="grid grid-cols-2 gap-2" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <div><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</div>
                  <div><strong>Mobile:</strong> {selectedOrder.shippingAddress?.phone}</div>
                  <div className="col-span-2">
                    <strong>Farm Address:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.villageCity}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </div>
                </div>
              </div>

              {/* Items & Payment Breakdown */}
              <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  📦 Farm Machinery Items:
                </div>
                <div className="flex flex-col gap-1.5" style={{ marginBottom: '0.75rem' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center" style={{ fontSize: '0.825rem' }}>
                      <span style={{ color: '#ffffff' }}>{item.name} <strong style={{ color: '#93c5fd' }}>(x{item.quantity})</strong></span>
                      <strong style={{ color: '#34d399' }}>{formatINR(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #1e2e4f', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Payment Mode: </span>
                    <strong style={{ color: '#fef08a' }}>{selectedOrder.payment?.method || 'COD'}</strong>
                    {selectedOrder.pricing?.couponCode && (
                      <span style={{ color: '#86efac', marginLeft: '0.5rem' }}>(Coupon: {selectedOrder.pricing.couponCode} -{formatINR(selectedOrder.pricing.discountTotal)})</span>
                    )}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#34d399' }}>
                    Grand Total: {formatINR(selectedOrder.pricing?.grandTotal || 0)}
                  </div>
                </div>
              </div>

              {/* Status & Tracking Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ background: '#0b1324', border: '1px solid #1e2e4f', borderRadius: '10px', padding: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Update Order Status *</label>
                  <select
                    className="select-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Confirmed">Confirmed (Order Accepted)</option>
                    <option value="Processing">Processing (Palletizing at Warehouse)</option>
                    <option value="Shipped">Shipped (Handed to Logistics Truck)</option>
                    <option value="Delivered">Delivered (Successfully Reached Farm)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Logistics Partner</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. AgriLogistics Express, Delhivery, V-Trans"
                  />
                </div>

                <div className="input-group md:col-span-2">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Waybill / Lorry Receipt (LR) Tracking Number</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. LR-AGRI-892348-IN"
                  />
                </div>

                <div className="input-group md:col-span-2">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Dispatch Note / Status Remark</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Machinery tested & loaded on dispatch truck. Expected delivery in 3 days."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center" style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Auto-syncs tracking to Farmer Dashboard instantly.
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary btn-sm"
                  >
                    {updating ? 'Updating Status...' : 'Save & Update Dispatch'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
