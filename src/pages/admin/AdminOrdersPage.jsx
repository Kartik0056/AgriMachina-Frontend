import React, { useState, useEffect, useMemo } from 'react';
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
  Download,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  PackageCheck,
  AlertCircle,
  Banknote,
  Percent,
  CheckCircle,
  XCircle,
  HelpCircle
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

const COURIER_PRESETS = [
  'Eidula Express',
  'Delhivery',
  'Blue Dart',
  'DTDC',
  'India Post',
  'Shadowfax',
  'Xpressbees'
];

const NOTE_TEMPLATES = [
  'QC passed & palletized for warehouse dispatch',
  'Handed over to logistics carrier for transit',
  'Consignment en route to customer destination hub',
  'Out for delivery with delivery executive',
  'Successfully delivered & verified by customer'
];

const STATUS_STEPS = [
  { key: 'Confirmed', label: 'Confirmed', desc: 'Order Accepted', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)' },
  { key: 'Processing', label: 'Processing', desc: 'Palletizing & QC', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)' },
  { key: 'Shipped', label: 'Shipped', desc: 'In Transit', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)' },
  { key: 'Delivered', label: 'Delivered', desc: 'Fulfilled', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)' },
  { key: 'Cancelled', label: 'Cancelled', desc: 'Voided & Restocked', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.35)' }
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Status update form in modal
  const [newStatus, setNewStatus] = useState('');
  const [courierName, setCourierName] = useState('Eidula Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Clipboard feedback indicators
  const [copiedRef, setCopiedRef] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

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

  const copyToClipboard = (text, type, id = null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'ref') {
      setCopiedRef(id || text);
      setTimeout(() => setCopiedRef(null), 1600);
      addToast(`Order ref #${text} copied!`, 'success');
    } else if (type === 'phone') {
      setCopiedPhone(id || text);
      setTimeout(() => setCopiedPhone(null), 1600);
      addToast('Phone number copied!', 'success');
    } else if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 1600);
      addToast('Customer address copied!', 'success');
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus || 'Confirmed');
    setCourierName(order.tracking?.courierName || 'Eidula Express');
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
      const filename = `Eidula-MyBillBook-Orders-${new Date().toISOString().slice(0, 10)}.csv`;
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
      const xml = generateTallyXml(orders[0]);
      const filename = `Eidula-Tally-Batch-${new Date().toISOString().slice(0, 10)}.xml`;
      downloadFile(xml, filename, 'application/xml');
      addToast(`Exported Tally Prime XML voucher for ${orders.length} orders!`, 'success');
    } catch (err) {
      addToast('Failed to generate Tally XML', 'error');
    }
  };

  const handleExportGeneralCsv = () => {
    if (filteredOrders.length === 0) {
      addToast('No orders to export', 'warning');
      return;
    }
    try {
      const headers = ['Order Ref', 'Date', 'Customer Name', 'Phone', 'Destination', 'Items', 'Payment Method', 'Payment Status', 'Grand Total (INR)', 'Order Status', 'Courier', 'AWB Tracking'];
      const rows = filteredOrders.map(o => [
        `"#${o.orderNumber || ''}"`,
        `"${new Date(o.createdAt).toLocaleDateString('en-IN')}"`,
        `"${o.customerName || o.shippingAddress?.fullName || 'Customer'}"`,
        `"${o.customerPhone || o.shippingAddress?.phone || ''}"`,
        `"${o.shippingAddress?.villageCity || o.shippingAddress?.city || ''}, ${o.shippingAddress?.state || ''}"`,
        `"${(o.items || []).map(i => `${i.name} (x${i.quantity})`).join('; ')}"`,
        `"${o.payment?.method || 'COD'}"`,
        `"${o.payment?.status || 'Pending'}"`,
        o.pricing?.grandTotal || 0,
        `"${o.orderStatus || ''}"`,
        `"${o.tracking?.courierName || ''}"`,
        `"${o.tracking?.trackingNumber || ''}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const filename = `Orders-Export-${new Date().toISOString().slice(0, 10)}.csv`;
      downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
      addToast(`Exported ${filteredOrders.length} orders to CSV!`, 'success');
    } catch (err) {
      addToast('Failed to export CSV', 'error');
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

  // Metrics calculation
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.pricing?.grandTotal || 0), 0);
  const confirmedCount = orders.filter(o => o.orderStatus === 'Confirmed').length;
  const processingCount = orders.filter(o => o.orderStatus === 'Processing').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.orderStatus === 'Cancelled').length;

  // Filtered & Sorted orders list
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (paymentFilter) {
      result = result.filter(o => {
        const method = (o.payment?.method || '').toLowerCase();
        if (paymentFilter === 'COD') return method.includes('cod') || method.includes('cash');
        if (paymentFilter === 'Online') return method.includes('online') || method.includes('upi') || method.includes('razorpay') || method.includes('card');
        if (paymentFilter === 'EMI') return method.includes('emi');
        return true;
      });
    }

    if (sortBy === 'date_desc') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'date_asc') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'amount_desc') {
      result.sort((a, b) => (b.pricing?.grandTotal || 0) - (a.pricing?.grandTotal || 0));
    } else if (sortBy === 'amount_asc') {
      result.sort((a, b) => (a.pricing?.grandTotal || 0) - (b.pricing?.grandTotal || 0));
    }

    return result;
  }, [orders, paymentFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, paymentFilter, searchQuery, itemsPerPage]);

  // Helper for tracking links
  const getTrackingUrl = (courier, awb) => {
    if (!awb) return null;
    const c = (courier || '').toLowerCase();
    if (c.includes('delhivery')) return `https://www.delhivery.com/track/package/${awb}`;
    if (c.includes('blue dart') || c.includes('bluedart')) return `https://www.bluedart.com/tracking`;
    if (c.includes('dtdc')) return `https://www.dtdc.in/tracking.asp`;
    if (c.includes('post')) return `https://www.indiapost.gov.in/_layouts/15/dpt.cpt.eta/tracking.aspx`;
    if (c.includes('shadowfax')) return `https://tracker.shadowfax.in/#/track?awb=${awb}`;
    return null;
  };

  const getInitials = (name) => {
    if (!name) return 'CU';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const resetAllFilters = () => {
    setStatusFilter('');
    setPaymentFilter('');
    setSearchQuery('');
    setSortBy('date_desc');
  };

  const hasActiveFilters = Boolean(statusFilter || paymentFilter || searchQuery || sortBy !== 'date_desc');

  return (
    <div className="flex flex-col gap-5" style={{ minHeight: '100%' }}>
      {/* Top Banner / Navigation Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--admin-accent, #10b981)',
              background: 'var(--admin-accent-glow, rgba(16, 185, 129, 0.15))',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px'
            }}>
              Operations • Fulfillment
            </span>
            <span className="flex items-center gap-1.5" style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Sync Active
            </span>
          </div>

          <h1 style={{
            fontSize: '1.25rem',
            color: 'var(--admin-text-main)',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            margin: 0
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: 'var(--admin-accent-glow, rgba(16, 185, 129, 0.12))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={16} color="var(--admin-accent, #10b981)" />
            </div>
            <span>Customer Orders & Invoicing Hub</span>
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem', margin: '0.2rem 0 0 0' }}>
            Manage order dispatch, print official GST Tax Invoices, and export vouchers to MyBillBook & Tally Prime.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export to CSV */}
          <button
            type="button"
            onClick={handleExportGeneralCsv}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'var(--admin-bg-card)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-main)',
              fontSize: '0.74rem',
              padding: '0.35rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Export filtered orders list to CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          {/* Export to MyBillBook */}
          <button
            type="button"
            onClick={handleExportBulkMyBillBook}
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.74rem',
              padding: '0.35rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
            }}
            title="Export all orders to MyBillBook CSV"
          >
            <FileSpreadsheet size={13} />
            <span>MyBillBook CSV</span>
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
              fontWeight: 600,
              fontSize: '0.74rem',
              padding: '0.35rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
            }}
            title="Export Tally Prime XML Vouchers"
          >
            <FileCode size={13} />
            <span>Tally XML</span>
          </button>

          {/* Refresh Now */}
          <button
            type="button"
            onClick={() => fetchOrders()}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'var(--admin-bg-card)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-main)',
              fontSize: '0.74rem',
              padding: '0.35rem 0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Reload latest live orders"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 4 Professional KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Orders Card */}
        <div
          onClick={() => setStatusFilter('')}
          className="admin-card flex flex-col justify-between"
          style={{
            cursor: 'pointer',
            padding: '0.85rem 1rem',
            border: statusFilter === '' ? '1px solid var(--admin-accent, #10b981)' : '1px solid var(--admin-border)',
            background: 'var(--admin-bg-card)',
            borderRadius: '9px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Total Orders
            </span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'var(--admin-accent-glow, rgba(16, 185, 129, 0.12))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={13} color="var(--admin-accent, #10b981)" />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--admin-text-main)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {totalOrders}
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: '0.35rem', fontSize: '0.7rem' }}>
            <span style={{ color: 'var(--admin-text-muted)' }}>Gross Volume:</span>
            <span style={{ color: 'var(--admin-accent, #10b981)', fontWeight: 700 }}>{formatINR(totalRevenue)}</span>
          </div>
        </div>

        {/* Confirmed / Ready to Pack */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Confirmed' ? '' : 'Confirmed')}
          className="admin-card flex flex-col justify-between"
          style={{
            cursor: 'pointer',
            padding: '0.85rem 1rem',
            border: statusFilter === 'Confirmed' ? '1px solid #38bdf8' : '1px solid var(--admin-border)',
            background: 'var(--admin-bg-card)',
            borderRadius: '9px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Ready to Pack
            </span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PackageCheck size={13} color="#38bdf8" />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {confirmedCount}
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: '0.35rem', fontSize: '0.7rem' }}>
            <span style={{ color: 'var(--admin-text-muted)' }}>Warehouse queue:</span>
            <span style={{ color: '#93c5fd', fontWeight: 600 }}>Ready to dispatch</span>
          </div>
        </div>

        {/* Shipped / In Transit */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Shipped' ? '' : 'Shipped')}
          className="admin-card flex flex-col justify-between"
          style={{
            cursor: 'pointer',
            padding: '0.85rem 1rem',
            border: statusFilter === 'Shipped' ? '1px solid #f59e0b' : '1px solid var(--admin-border)',
            background: 'var(--admin-bg-card)',
            borderRadius: '9px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              In Transit
            </span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={13} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {shippedCount}
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: '0.35rem', fontSize: '0.7rem' }}>
            <span style={{ color: 'var(--admin-text-muted)' }}>With carrier:</span>
            <span style={{ color: '#fde047', fontWeight: 600 }}>En route to customer</span>
          </div>
        </div>

        {/* Delivered / Fulfilled */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'Delivered' ? '' : 'Delivered')}
          className="admin-card flex flex-col justify-between"
          style={{
            cursor: 'pointer',
            padding: '0.85rem 1rem',
            border: statusFilter === 'Delivered' ? '1px solid #10b981' : '1px solid var(--admin-border)',
            background: 'var(--admin-bg-card)',
            borderRadius: '9px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
          }}
        >
          <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Delivered
            </span>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={13} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--admin-accent, #10b981)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {deliveredCount}
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: '0.35rem', fontSize: '0.7rem' }}>
            <span style={{ color: 'var(--admin-text-muted)' }}>Fulfillment rate:</span>
            <span style={{ color: '#86efac', fontWeight: 700 }}>
              {totalOrders > 0 ? `${Math.round((deliveredCount / totalOrders) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Filters Bar */}
      <div
        className="admin-card flex justify-between items-center"
        style={{
          padding: '0.65rem 0.9rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: 'var(--admin-bg-card)',
          borderColor: 'var(--admin-border)',
          borderRadius: '9px'
        }}
      >
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontWeight: 700, marginRight: '0.2rem' }}>
            Filter:
          </span>
          {[
            { id: '', label: 'All', count: totalOrders },
            { id: 'Confirmed', label: 'Confirmed', count: confirmedCount },
            { id: 'Processing', label: 'Processing', count: processingCount },
            { id: 'Shipped', label: 'Shipped', count: shippedCount },
            { id: 'Delivered', label: 'Delivered', count: deliveredCount },
            { id: 'Cancelled', label: 'Cancelled', count: cancelledCount }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id || 'all'}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className="btn btn-sm"
                style={{
                  background: isActive ? 'var(--admin-accent, #10b981)' : 'var(--admin-bg-card-alt)',
                  borderColor: isActive ? 'var(--admin-accent, #10b981)' : 'var(--admin-border)',
                  color: isActive ? '#ffffff' : 'var(--admin-text-main)',
                  fontSize: '0.72rem',
                  padding: '0.24rem 0.6rem',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.05rem 0.35rem',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'var(--admin-border-subtle, rgba(255,255,255,0.06))',
                  color: isActive ? '#ffffff' : 'var(--admin-text-muted)',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Search, Payment & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Payment Method Filter */}
          <select
            className="select-field"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{
              fontSize: '0.74rem',
              padding: '0.35rem 0.6rem',
              height: '32px',
              minWidth: '120px',
              background: 'var(--admin-bg-main)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text-main)',
              borderRadius: '6px'
            }}
          >
            <option value="">All Payments</option>
            <option value="Online">Online / UPI / Card</option>
            <option value="COD">Cash on Delivery</option>
            <option value="EMI">EMI Payment</option>
          </select>

          {/* Sort By Dropdown */}
          <div className="flex items-center" style={{ position: 'relative' }}>
            <select
              className="select-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                fontSize: '0.74rem',
                padding: '0.35rem 0.6rem',
                height: '32px',
                minWidth: '140px',
                background: 'var(--admin-bg-main)',
                borderColor: 'var(--admin-border)',
                color: 'var(--admin-text-main)',
                borderRadius: '6px'
              }}
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="amount_desc">Amount: High to Low</option>
              <option value="amount_asc">Amount: Low to High</option>
            </select>
          </div>

          {/* Live Search Input */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search
              size={13}
              color="var(--admin-text-muted)"
              style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              className="input-field"
              style={{
                paddingLeft: '1.85rem',
                paddingRight: searchQuery ? '1.85rem' : '0.65rem',
                fontSize: '0.75rem',
                height: '32px',
                paddingTop: 0,
                paddingBottom: 0,
                background: 'var(--admin-bg-main)',
                borderColor: 'var(--admin-border)',
                color: 'var(--admin-text-main)',
                borderRadius: '6px'
              }}
              placeholder="Search #, customer, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.72rem',
                height: '32px',
                padding: '0 0.5rem',
                color: 'var(--admin-text-muted)',
                background: 'transparent',
                borderColor: 'var(--admin-border)',
                borderRadius: '6px'
              }}
              title="Reset all search & filter conditions"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Orders Data Table Container */}
      <div
        className="admin-card"
        style={{
          padding: 0,
          overflow: 'hidden',
          background: 'var(--admin-bg-card)',
          borderColor: 'var(--admin-border)',
          borderRadius: '9px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ fontSize: '0.78rem', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--admin-bg-card-alt)', borderBottom: '1px solid var(--admin-border)' }}>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)', width: '130px' }}>
                  Order Ref
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)' }}>
                  Customer Details
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)', width: '220px' }}>
                  Items Ordered
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)' }}>
                  Destination
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)' }}>
                  Payment
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)' }}>
                  Grand Total
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)' }}>
                  Status
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)' }}>
                  Tax & ERP Invoicing
                </th>
                <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--admin-text-muted)', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <RefreshCw size={22} className="animate-spin" color="var(--admin-accent, #10b981)" style={{ margin: '0 auto 0.6rem auto' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Loading live orders from MongoDB...</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-subtle, #64748b)' }}>Connecting to sync stream</div>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--admin-bg-card-alt)', margin: '0 auto 0.75rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Search size={18} color="var(--admin-text-muted)" />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>No matching orders found</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', maxWidth: '350px', margin: '0.25rem auto 0.75rem auto' }}>
                      Try adjusting your status filter, search keywords, or payment method to find orders.
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const customerName = order.customerName || order.shippingAddress?.fullName || 'Customer';
                  const customerPhone = order.customerPhone || order.shippingAddress?.phone || '';
                  const grandTotal = order.pricing?.grandTotal || 0;
                  const isCopied = copiedRef === order.orderNumber;
                  const isCopiedP = copiedPhone === customerPhone;

                  return (
                    <tr
                      key={order._id}
                      style={{
                        borderBottom: '1px solid var(--admin-border-subtle, rgba(255,255,255,0.05))',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* Order Reference */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.78rem' }}>
                            #{order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(order.orderNumber, 'ref', order.orderNumber)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: isCopied ? '#10b981' : 'var(--admin-text-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'inline-flex'
                            }}
                            title="Copy Order Reference #"
                          >
                            {isCopied ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                          </button>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <div className="flex items-center gap-2">
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(16, 185, 129, 0.2))',
                            color: 'var(--admin-text-main)',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getInitials(customerName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                              {customerName}
                            </div>
                            <div className="flex items-center gap-1" style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', marginTop: '1px' }}>
                              <a
                                href={`tel:${customerPhone}`}
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                title="Click to call customer"
                              >
                                {customerPhone ? `📞 ${customerPhone}` : 'No phone'}
                              </a>
                              {customerPhone && (
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(customerPhone, 'phone', customerPhone)}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: isCopiedP ? '#10b981' : 'var(--admin-text-muted)',
                                    cursor: 'pointer',
                                    padding: '1px',
                                    display: 'inline-flex'
                                  }}
                                  title="Copy phone number"
                                >
                                  {isCopiedP ? <Check size={10} color="#10b981" /> : <Copy size={10} />}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Items Ordered */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <div className="flex flex-col gap-1" style={{ maxWidth: '210px' }}>
                          {(order.items || []).slice(0, 2).map((it, idx) => (
                            <div
                              key={idx}
                              style={{
                                fontSize: '0.72rem',
                                color: 'var(--admin-text-main)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={it.name}
                            >
                              • {it.name} <span style={{ color: '#93c5fd', fontWeight: 600 }}>(x{it.quantity})</span>
                            </div>
                          ))}
                          {(order.items || []).length > 2 && (
                            <div style={{ fontSize: '0.65rem', color: 'var(--admin-accent, #10b981)', fontWeight: 600 }}>
                              + {order.items.length - 2} more item(s)
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Destination */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <div className="flex items-start gap-1">
                          <MapPin size={11} color="var(--admin-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--admin-text-main)', fontWeight: 500 }}>
                              {order.shippingAddress?.villageCity || order.shippingAddress?.city || 'Local Area'}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)' }}>
                              {order.shippingAddress?.state || ''} {order.shippingAddress?.pincode ? `• ${order.shippingAddress.pincode}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Payment */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <span
                          className={`badge ${
                            order.payment?.method?.includes('EMI')
                              ? 'badge-warning'
                              : order.payment?.method?.includes('Online') || order.payment?.method?.includes('UPI') || order.payment?.method?.includes('Razorpay')
                              ? 'badge-success'
                              : 'badge-primary'
                          }`}
                          style={{ fontSize: '0.68rem', padding: '0.2rem 0.45rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          {order.payment?.method?.includes('EMI') && <Percent size={10} />}
                          {order.payment?.method?.includes('Online') && <CreditCard size={10} />}
                          {!order.payment?.method?.includes('EMI') && !order.payment?.method?.includes('Online') && <Banknote size={10} />}
                          <span>{order.payment?.method || 'COD'}</span>
                        </span>
                        <div style={{ fontSize: '0.65rem', color: order.payment?.status === 'Paid' ? '#86efac' : 'var(--admin-text-muted)', marginTop: '2px' }}>
                          {order.payment?.status || 'Pending'}
                        </div>
                      </td>

                      {/* Grand Total Value */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--admin-text-main)', fontSize: '0.825rem' }}>
                          {formatINR(grandTotal)}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--admin-accent, #10b981)' }}>
                          Tax Inc.
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background:
                              order.orderStatus === 'Delivered'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : order.orderStatus === 'Shipped'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : order.orderStatus === 'Processing'
                                ? 'rgba(168, 85, 247, 0.15)'
                                : order.orderStatus === 'Cancelled'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(56, 189, 248, 0.15)',
                            color:
                              order.orderStatus === 'Delivered'
                                ? '#10b981'
                                : order.orderStatus === 'Shipped'
                                ? '#f59e0b'
                                : order.orderStatus === 'Processing'
                                ? '#a855f7'
                                : order.orderStatus === 'Cancelled'
                                ? '#ef4444'
                                : '#38bdf8',
                            border: `1px solid ${
                              order.orderStatus === 'Delivered'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : order.orderStatus === 'Shipped'
                                ? 'rgba(245, 158, 11, 0.3)'
                                : order.orderStatus === 'Processing'
                                ? 'rgba(168, 85, 247, 0.3)'
                                : order.orderStatus === 'Cancelled'
                                ? 'rgba(239, 68, 68, 0.3)'
                                : 'rgba(56, 189, 248, 0.3)'
                            }`
                          }}
                        >
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: 'currentColor'
                          }} />
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Tax & ERP Invoicing */}
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <div className="flex items-center gap-1">
                          {/* Invoice View/Print */}
                          <button
                            type="button"
                            onClick={() => openInvoiceModal(order)}
                            className="btn btn-sm"
                            style={{
                              background: 'rgba(34, 197, 94, 0.12)',
                              border: '1px solid rgba(34, 197, 94, 0.35)',
                              color: '#86efac',
                              padding: '0.2rem 0.45rem',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              borderRadius: '4px'
                            }}
                            title="Generate and print official GST Tax Invoice"
                          >
                            <Printer size={11} />
                            <span>Invoice</span>
                          </button>

                          {/* Quick Tally XML */}
                          <button
                            type="button"
                            onClick={() => {
                              const xml = generateTallyXml(order);
                              downloadFile(xml, `Tally-${order.orderNumber}.xml`, 'application/xml');
                              addToast('Tally Prime XML voucher downloaded!', 'success');
                            }}
                            className="btn btn-sm"
                            style={{
                              background: 'rgba(56, 189, 248, 0.12)',
                              border: '1px solid rgba(56, 189, 248, 0.35)',
                              color: '#7dd3fc',
                              padding: '0.2rem 0.4rem',
                              fontSize: '0.68rem',
                              borderRadius: '4px'
                            }}
                            title="Download Tally Prime Voucher XML"
                          >
                            Tally
                          </button>

                          {/* Quick MyBillBook CSV */}
                          <button
                            type="button"
                            onClick={() => {
                              const csv = generateMyBillBookCsv(order);
                              downloadFile(csv, `MyBillBook-${order.orderNumber}.csv`, 'text/csv;');
                              addToast('MyBillBook CSV invoice downloaded!', 'success');
                            }}
                            className="btn btn-sm"
                            style={{
                              background: 'rgba(251, 191, 36, 0.12)',
                              border: '1px solid rgba(251, 191, 36, 0.35)',
                              color: '#fde047',
                              padding: '0.2rem 0.4rem',
                              fontSize: '0.68rem',
                              borderRadius: '4px'
                            }}
                            title="Download MyBillBook CSV"
                          >
                            BillBook
                          </button>
                        </div>
                      </td>

                      {/* Manage Order Action */}
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => openOrderModal(order)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            background: 'var(--admin-bg-card-alt)',
                            borderColor: 'var(--admin-border)',
                            color: 'var(--admin-text-main)',
                            padding: '0.28rem 0.6rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            borderRadius: '5px'
                          }}
                        >
                          <Eye size={12} />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Counter Bar */}
        <div
          className="flex justify-between items-center"
          style={{
            padding: '0.6rem 1rem',
            borderTop: '1px solid var(--admin-border)',
            background: 'var(--admin-bg-card-alt)',
            fontSize: '0.72rem',
            color: 'var(--admin-text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div className="flex items-center gap-1" style={{ marginLeft: '0.5rem' }}>
              <span>Per page:</span>
              <select
                className="select-field"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                style={{
                  height: '24px',
                  fontSize: '0.7rem',
                  padding: '0 0.4rem',
                  background: 'var(--admin-bg-main)',
                  borderColor: 'var(--admin-border)',
                  color: 'var(--admin-text-main)',
                  borderRadius: '4px'
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="btn btn-secondary btn-sm"
              style={{
                height: '26px',
                padding: '0 0.5rem',
                fontSize: '0.7rem',
                borderRadius: '4px',
                background: 'var(--admin-bg-card)',
                borderColor: 'var(--admin-border)',
                color: 'var(--admin-text-main)',
                opacity: currentPage <= 1 ? 0.4 : 1
              }}
            >
              <ChevronLeft size={12} />
              <span>Prev</span>
            </button>

            <span style={{ fontSize: '0.7rem', padding: '0 0.35rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="btn btn-secondary btn-sm"
              style={{
                height: '26px',
                padding: '0 0.5rem',
                fontSize: '0.7rem',
                borderRadius: '4px',
                background: 'var(--admin-bg-card)',
                borderColor: 'var(--admin-border)',
                color: 'var(--admin-text-main)',
                opacity: currentPage >= totalPages ? 0.4 : 1
              }}
            >
              <span>Next</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Redesigned Order Manage & Fulfillment Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setIsDetailModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--admin-modal-overlay, rgba(11, 19, 36, 0.75))',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '780px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: 'var(--admin-bg-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: '12px',
              padding: '1.25rem',
              color: 'var(--admin-text-main)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Modal Header */}
            <div
              className="flex justify-between items-center"
              style={{
                borderBottom: '1px solid var(--admin-border)',
                paddingBottom: '0.75rem',
                marginBottom: '1rem'
              }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    #{selectedOrder.orderNumber}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--admin-text-main)', margin: 0 }}>
                    Manage Fulfillment & Dispatch
                  </h3>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '2px' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openInvoiceModal(selectedOrder)}
                  className="btn btn-sm"
                  style={{
                    background: 'var(--admin-accent, #10b981)',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.72rem',
                    borderRadius: '6px'
                  }}
                >
                  <FileText size={12} />
                  <span>GST Tax Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{
                    background: 'var(--admin-bg-card-alt)',
                    border: '1px solid var(--admin-border)',
                    color: 'var(--admin-text-muted)',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Close modal"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Structured Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginBottom: '1rem' }}>
              {/* Customer & Shipping Details Card */}
              <div
                style={{
                  background: 'var(--admin-bg-card-alt)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  padding: '0.85rem'
                }}
              >
                <div className="flex justify-between items-center" style={{ marginBottom: '0.45rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-accent, #10b981)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    📦 Shipping & Consignee
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const addr = `${selectedOrder.shippingAddress?.fullName || selectedOrder.customerName}, ${selectedOrder.shippingAddress?.phone || selectedOrder.customerPhone}, ${selectedOrder.shippingAddress?.street || ''}, ${selectedOrder.shippingAddress?.villageCity || selectedOrder.shippingAddress?.city || ''}, ${selectedOrder.shippingAddress?.district || ''}, ${selectedOrder.shippingAddress?.state || ''} - ${selectedOrder.shippingAddress?.pincode || ''}`;
                      copyToClipboard(addr, 'address');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedAddress ? '#10b981' : 'var(--admin-text-muted)',
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                    title="Copy full shipping address for courier booking"
                  >
                    {copiedAddress ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                    <span>{copiedAddress ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5" style={{ fontSize: '0.76rem', color: 'var(--admin-text-main)' }}>
                  <div>
                    <span style={{ color: 'var(--admin-text-muted)' }}>Name: </span>
                    <strong>{selectedOrder.shippingAddress?.fullName || selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--admin-text-muted)' }}>Mobile: </span>
                    <a
                      href={`tel:${selectedOrder.shippingAddress?.phone || selectedOrder.customerPhone}`}
                      style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
                    >
                      {selectedOrder.shippingAddress?.phone || selectedOrder.customerPhone || 'N/A'}
                    </a>
                  </div>
                  <div style={{ lineHeight: 1.4, marginTop: '2px' }}>
                    <span style={{ color: 'var(--admin-text-muted)' }}>Delivery Address: </span>
                    <span>
                      {[
                        selectedOrder.shippingAddress?.street,
                        selectedOrder.shippingAddress?.villageCity || selectedOrder.shippingAddress?.city,
                        selectedOrder.shippingAddress?.district,
                        selectedOrder.shippingAddress?.state,
                        selectedOrder.shippingAddress?.pincode ? `PIN: ${selectedOrder.shippingAddress.pincode}` : ''
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items & Financial Summary Card */}
              <div
                style={{
                  background: 'var(--admin-bg-card-alt)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  padding: '0.85rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-accent, #10b981)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
                  🛍️ Items & Financials
                </div>

                <div className="flex flex-col gap-1" style={{ maxHeight: '90px', overflowY: 'auto', marginBottom: '0.5rem', paddingRight: '0.25rem' }}>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center" style={{ fontSize: '0.74rem' }}>
                      <span style={{ color: 'var(--admin-text-main)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name} <strong style={{ color: '#93c5fd' }}>(x{item.quantity})</strong>
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--admin-border-subtle, rgba(255,255,255,0.06))',
                    paddingTop: '0.45rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.74rem'
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: 'var(--admin-text-muted)' }}>Payment:</span>
                    <span style={{ fontWeight: 700, color: '#fef08a' }}>
                      {selectedOrder.payment?.method || 'COD'}
                    </span>
                    {selectedOrder.pricing?.couponCode && (
                      <span style={{ color: '#86efac', fontSize: '0.68rem' }}>
                        ({selectedOrder.pricing.couponCode})
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--admin-accent, #10b981)', fontSize: '0.88rem' }}>
                    {formatINR(selectedOrder.pricing?.grandTotal || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Fulfillment & Dispatch Form */}
            <form onSubmit={handleUpdateOrderStatus} className="flex flex-col gap-3.5">
              <div
                style={{
                  background: 'var(--admin-bg-main)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '9px',
                  padding: '0.9rem'
                }}
              >
                {/* Step 1: Visual Status Workflow Selector */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--admin-text-main)',
                      marginBottom: '0.35rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    1. Select Order Fulfillment Status *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {STATUS_STEPS.map((st) => {
                      const isSelected = newStatus === st.key;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => {
                            setNewStatus(st.key);
                            // Pre-fill note suggestion if note is currently blank
                            if (!statusNote) {
                              if (st.key === 'Processing') setStatusNote('Order items verified by warehouse team; ready for dispatch.');
                              if (st.key === 'Shipped') setStatusNote('Dispatched securely with express logistics carrier.');
                              if (st.key === 'Delivered') setStatusNote('Consignment successfully delivered to customer address.');
                              if (st.key === 'Cancelled') setStatusNote('Order cancelled by admin; items restocked.');
                            }
                          }}
                          style={{
                            background: isSelected ? st.bg : 'var(--admin-bg-card)',
                            border: `1.5px solid ${isSelected ? st.color : 'var(--admin-border)'}`,
                            color: isSelected ? st.color : 'var(--admin-text-main)',
                            borderRadius: '7px',
                            padding: '0.4rem 0.5rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div className="flex justify-between items-center" style={{ width: '100%' }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>{st.label}</span>
                            {isSelected && <CheckCircle size={11} color={st.color} />}
                          </div>
                          <span style={{ fontSize: '0.62rem', color: isSelected ? st.color : 'var(--admin-text-muted)' }}>
                            {st.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Logistics Partner & AWB Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ marginBottom: '0.85rem' }}>
                  {/* Courier Partner */}
                  <div>
                    <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                        2. Logistics Carrier
                      </label>
                      <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)' }}>Quick Presets:</span>
                    </div>

                    <div className="flex items-center gap-1" style={{ position: 'relative', marginBottom: '0.35rem' }}>
                      <Truck size={13} color="var(--admin-text-muted)" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        className="input-field"
                        style={{
                          paddingLeft: '1.75rem',
                          fontSize: '0.76rem',
                          height: '32px',
                          background: 'var(--admin-bg-card)',
                          borderColor: 'var(--admin-border)',
                          color: 'var(--admin-text-main)',
                          borderRadius: '6px'
                        }}
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="e.g. Eidula Express, Delhivery..."
                      />
                    </div>

                    {/* Quick Carrier Preset Pills */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {COURIER_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCourierName(preset)}
                          style={{
                            fontSize: '0.62rem',
                            padding: '0.12rem 0.4rem',
                            borderRadius: '4px',
                            background: courierName === preset ? 'var(--admin-accent-glow, rgba(16, 185, 129, 0.15))' : 'var(--admin-bg-card)',
                            border: `1px solid ${courierName === preset ? 'var(--admin-accent, #10b981)' : 'var(--admin-border)'}`,
                            color: courierName === preset ? 'var(--admin-accent, #10b981)' : 'var(--admin-text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AWB Tracking Number */}
                  <div>
                    <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                        3. AWB Tracking Number
                      </label>
                      {getTrackingUrl(courierName, trackingNumber) && (
                        <a
                          href={getTrackingUrl(courierName, trackingNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.65rem',
                            color: '#38bdf8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.15rem',
                            textDecoration: 'none'
                          }}
                        >
                          <span>Test Link</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1" style={{ position: 'relative' }}>
                      <Tag size={13} color="var(--admin-text-muted)" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        className="input-field"
                        style={{
                          paddingLeft: '1.75rem',
                          paddingRight: '3.5rem',
                          fontSize: '0.76rem',
                          height: '32px',
                          background: 'var(--admin-bg-card)',
                          borderColor: 'var(--admin-border)',
                          color: 'var(--admin-text-main)',
                          borderRadius: '6px'
                        }}
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. SIDD-AWB-90284"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              setTrackingNumber(text.trim());
                              addToast('Tracking number pasted!', 'success');
                            }
                          } catch (err) {
                            addToast('Unable to read from clipboard', 'warning');
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: '5px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '0.65rem',
                          background: 'var(--admin-bg-card-alt)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text-muted)',
                          borderRadius: '4px',
                          padding: '0.15rem 0.4rem',
                          cursor: 'pointer'
                        }}
                      >
                        Paste
                      </button>
                    </div>

                    <div style={{ fontSize: '0.64rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem' }}>
                      Provides real-time tracking updates directly on customer order status.
                    </div>
                  </div>
                </div>

                {/* Step 3: Status Note / Remark with Templates */}
                <div>
                  <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
                      4. Dispatch Note / Status Remark
                    </label>
                    <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)' }}>1-Click Templates:</span>
                  </div>

                  <input
                    type="text"
                    className="input-field"
                    style={{
                      fontSize: '0.76rem',
                      height: '32px',
                      background: 'var(--admin-bg-card)',
                      borderColor: 'var(--admin-border)',
                      color: 'var(--admin-text-main)',
                      borderRadius: '6px',
                      marginBottom: '0.35rem'
                    }}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Product verified and handed over for express air dispatch."
                  />

                  {/* 1-Click Note Templates */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {NOTE_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl}
                        type="button"
                        onClick={() => setStatusNote(tmpl)}
                        style={{
                          fontSize: '0.62rem',
                          padding: '0.12rem 0.4rem',
                          borderRadius: '4px',
                          background: 'var(--admin-bg-card)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        + {tmpl.slice(0, 32)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div
                className="flex justify-between items-center"
                style={{
                  paddingTop: '0.35rem',
                  borderTop: '1px solid var(--admin-border)'
                }}
              >
                <div className="flex items-center gap-1.5" style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                  <ShieldCheck size={13} color="var(--admin-accent, #10b981)" />
                  <span>Updates customer timeline & inventory logs instantaneously.</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      background: 'var(--admin-bg-card-alt)',
                      borderColor: 'var(--admin-border)',
                      color: 'var(--admin-text-main)',
                      fontSize: '0.74rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary btn-sm"
                    style={{
                      background: 'var(--admin-accent, #10b981)',
                      borderColor: 'var(--admin-accent, #10b981)',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.35rem 0.85rem',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {updating ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        <span>Updating Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Save & Update Dispatch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GST Tax Invoice & Accounting Modal */}
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
