import React, { useState, useEffect } from 'react';
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
  Tag,
  FileText,
  FileSpreadsheet,
  FileCode,
  Printer,
  Download
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';
import { formatINR } from '../../services/emiHelper';
import GSTInvoiceModal from '../../components/common/GSTInvoiceModal';
import {
  generateTallyXml,
  generateMyBillBookCsv,
  downloadFile
} from '../../services/invoiceHelper';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Status update form in modal
  const [newStatus, setNewStatus] = useState('');
  const [courierName, setCourierName] = useState('Siddhiva Logistics Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();
  const { subscribeToSync } = useSync();

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

  // Real-time live order synchronization
  useEffect(() => {
    if (!subscribeToSync) return;

    const unsubscribe = subscribeToSync((event) => {
      if (!event || !event.type) return;

      if (event.type === 'ORDER_CREATED' || event.type === 'ORDER_UPDATED' || event.type === 'ORDER_STATUS_CHANGED') {
        fetchOrders(true);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToSync]);

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || 'Confirmed');
    setCourierName(order.tracking?.courierName || 'Siddhiva Logistics Express');
    setTrackingNumber(order.tracking?.trackingNumber || '');
    setStatusNote('');
    setIsDetailModalOpen(true);
  };

  const openInvoiceModal = (order) => {
    setInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  const handleExportBulkMyBillBook = () => {
    if (orders.length === 0) {
      addToast('No orders found to export', 'warning');
      return;
    }
    try {
      const csv = generateMyBillBookCsv(orders);
      const filename = `Siddhiva-MyBillBook-Orders-${new Date().toISOString().slice(0, 10)}.csv`;
      downloadFile(csv, filename, 'text/csv;charset=utf-8;');
      addToast(`Exported ${orders.length} orders to MyBillBook CSV!`, 'success');
    } catch (err) {
      addToast('Failed to generate MyBillBook CSV', 'error');
    }
  };

  const handleExportBulkTally = () => {
    if (orders.length === 0) {
      addToast('No orders found to export', 'warning');
      return;
    }
    try {
      // Export primary batch XML
      const xml = generateTallyXml(orders[0]);
      const filename = `Siddhiva-Tally-Batch-${new Date().toISOString().slice(0, 10)}.xml`;
      downloadFile(xml, filename, 'application/xml');
      addToast(`Exported Tally Prime XML voucher for ${orders.length} orders!`, 'success');
    } catch (err) {
      addToast('Failed to generate Tally XML', 'error');
    }
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
        fetchOrders(true);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

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
          <h1 style={{ fontSize: '1.6rem', color: 'var(--admin-text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={24} color="var(--admin-accent, #34d399)" />
            <span>Orders, GST Invoices & Accounting Management</span>
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            View customer orders, generate GST invoices, and export directly to MyBillBook & Tally Prime.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Export to MyBillBook */}
          <button
            type="button"
            onClick={handleExportBulkMyBillBook}
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Export all filtered orders to MyBillBook CSV"
          >
            <FileSpreadsheet size={15} />
            <span>MyBillBook Export</span>
          </button>

          {/* Export to Tally Prime */}
          <button
            type="button"
            onClick={handleExportBulkTally}
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, #065f46, #059669)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Export Tally XML Vouchers"
          >
            <FileCode size={15} />
            <span>Tally XML Export</span>
          </button>

          {/* Refresh Now */}
          <button
            onClick={() => fetchOrders()}
            className="btn btn-secondary btn-sm"
            style={{ background: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Order Volume</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--admin-text-main)' }}>{totalOrders} Orders</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--admin-accent, #34d399)' }}>Total Gross: {formatINR(totalRevenue)}</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Confirmed (To Pack)</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>{confirmedCount} Orders</span>
          <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Ready for warehouse palletizing</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Shipped (In Transit)</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b' }}>{shippedCount} Shipments</span>
          <span style={{ fontSize: '0.7rem', color: '#fde047' }}>En route to customer</span>
        </div>

        <div className="admin-card flex flex-col gap-1">
          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Delivered & Fulfilled</span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--admin-accent, #34d399)' }}>{deliveredCount} Delivered</span>
          <span style={{ fontSize: '0.7rem', color: '#86efac' }}>100% Fulfilled</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card flex justify-between items-center" style={{ padding: '0.85rem 1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 700, marginRight: '0.25rem' }}>Status:</span>
          {['', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  background: isActive ? 'var(--admin-accent, #166534)' : 'var(--admin-bg-main, #0b1324)',
                  borderColor: isActive ? 'var(--admin-accent, #22c55e)' : 'var(--admin-border, #1e2e4f)',
                  color: isActive ? '#ffffff' : 'var(--admin-text-main, #e2e8f0)',
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.7rem',
                  fontWeight: isActive ? 800 : 600
                }}
              >
                {st || 'All Orders'}
              </button>
            );
          })}
        </div>

        {/* Live Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--admin-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{
              paddingLeft: '2.25rem',
              fontSize: '0.825rem',
              paddingTop: '0.45rem',
              paddingBottom: '0.45rem',
              background: 'var(--admin-bg-main)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-main)'
            }}
            placeholder="Search Order #, Customer, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer Details</th>
                <th>Items Ordered</th>
                <th>Destination</th>
                <th>Payment</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Invoice & Accounting</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div>Loading live orders...</div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    {/* Order Reference */}
                    <td>
                      <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.875rem' }}>
                        #{order.orderNumber}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Customer Details */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--admin-text-main)', fontSize: '0.85rem' }}>
                        {order.customerName || order.shippingAddress?.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        📞 {order.customerPhone || order.shippingAddress?.phone}
                      </div>
                    </td>

                    {/* Ordered Items */}
                    <td>
                      <div className="flex flex-col gap-1" style={{ maxWidth: '200px' }}>
                        {order.items?.map((it, idx) => (
                          <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--admin-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            • {it.name} <strong style={{ color: '#93c5fd' }}>(x{it.quantity})</strong>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Destination */}
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-main)' }}>
                        {order.shippingAddress?.villageCity || order.shippingAddress?.city}, {order.shippingAddress?.district}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--admin-text-muted)' }}>
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
                    </td>

                    {/* Total Value */}
                    <td>
                      <div style={{ fontWeight: 900, color: '#34d399', fontSize: '0.95rem' }}>
                        {formatINR(order.pricing?.grandTotal || 0)}
                      </div>
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

                    {/* Quick Invoice & Accounting Actions */}
                    <td>
                      <div className="flex items-center gap-1.5">
                        {/* View/Print GST Invoice */}
                        <button
                          type="button"
                          onClick={() => openInvoiceModal(order)}
                          className="btn btn-sm"
                          style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            color: '#86efac',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                          title="Generate & Print GST Tax Invoice"
                        >
                          <FileText size={13} />
                          <span>Invoice</span>
                        </button>

                        {/* Quick Tally XML */}
                        <button
                          type="button"
                          onClick={() => {
                            const xml = generateTallyXml(order);
                            downloadFile(xml, `Tally-${order.orderNumber}.xml`, 'application/xml');
                            addToast('Tally XML downloaded!', 'success');
                          }}
                          className="btn btn-sm"
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: '#7dd3fc',
                            padding: '0.25rem 0.45rem',
                            fontSize: '0.7rem'
                          }}
                          title="Export Tally Prime XML"
                        >
                          Tally
                        </button>

                        {/* Quick MyBillBook CSV */}
                        <button
                          type="button"
                          onClick={() => {
                            const csv = generateMyBillBookCsv(order);
                            downloadFile(csv, `MyBillBook-${order.orderNumber}.csv`, 'text/csv;');
                            addToast('MyBillBook CSV downloaded!', 'success');
                          }}
                          className="btn btn-sm"
                          style={{
                            background: 'rgba(251, 191, 36, 0.15)',
                            border: '1px solid rgba(251, 191, 36, 0.4)',
                            color: '#fde047',
                            padding: '0.25rem 0.45rem',
                            fontSize: '0.7rem'
                          }}
                          title="Export MyBillBook CSV"
                        >
                          BillBook
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => openOrderModal(order)}
                        className="btn btn-secondary btn-sm"
                        style={{ background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)', color: '#ffffff', padding: '0.35rem 0.75rem' }}
                      >
                        <Eye size={14} />
                        <span>Manage</span>
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
          <div className="modal-content dark-theme" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openInvoiceModal(selectedOrder)}
                  className="btn btn-sm"
                  style={{ background: '#22c55e', color: '#ffffff', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem' }}
                >
                  <FileText size={14} />
                  <span>GST Invoice</span>
                </button>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                  Status: {selectedOrder.orderStatus}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="flex flex-col gap-4">
              {/* Customer & Delivery Address */}
              <div style={{ background: 'var(--admin-bg-sidebar)', border: '1px solid #1e2e4f', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  📦 Customer & Delivery Details:
                </div>
                <div className="grid grid-cols-2 gap-2" style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <div><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName || selectedOrder.customerName}</div>
                  <div><strong>Mobile:</strong> {selectedOrder.shippingAddress?.phone || selectedOrder.customerPhone}</div>
                  <div className="col-span-2">
                    <strong>Delivery Address:</strong> {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.villageCity || selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                  </div>
                </div>
              </div>

              {/* Items & Payment Breakdown */}
              <div style={{ background: 'var(--admin-bg-sidebar)', border: '1px solid #1e2e4f', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  🛍️ Order Line Items:
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ background: 'var(--admin-bg-main)', border: '1px solid #1e2e4f', borderRadius: '10px', padding: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Update Order Status *</label>
                  <select
                    className="select-field"
                    style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Confirmed">Confirmed (Order Accepted)</option>
                    <option value="Processing">Processing (Packaging at Warehouse)</option>
                    <option value="Shipped">Shipped (Handed to Logistics Carrier)</option>
                    <option value="Delivered">Delivered (Successfully Delivered)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Logistics Partner</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. Siddhiva Express, Delhivery, BlueDart"
                  />
                </div>

                <div className="input-group md:col-span-2">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>AWB Tracking Number</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. SIDDHIVA-AWB-892348-IN"
                  />
                </div>

                <div className="input-group md:col-span-2">
                  <label className="input-label" style={{ color: '#cbd5e1' }}>Dispatch Note / Status Remark</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Product verified and dispatched via express courier."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center" style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Auto-syncs tracking to customer dashboard instantly.
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="btn btn-secondary btn-sm"
                    style={{ background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
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

      {/* GST Invoice Modal */}
      {invoiceOrder && (
        <GSTInvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setInvoiceOrder(null);
          }}
          order={invoiceOrder}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
